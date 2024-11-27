class Tile {
    constructor(gameManager, plant = null, waterLvl = 0, sunLvl = 0) {
        this.gameManager = gameManager

        this.plant = plant
        this.waterLvl = waterLvl
        this.sunLvl = sunLvl
    }

    // Encode the current state into a bitfield
    saveTile() {
        const species = this.plant ? this.plant.species : 0
        const growthLevel = this.plant ? this.plant.growthLevel : 0

        return this.encodeTileData(this.sunLvl, this.waterLvl, species, growthLevel)
    }

    cleanTile() {
        this.plant && this.plant.destroy()
        this.plant = null
        this.sunLvl = 0
        this.waterLvl = 0
    }

    // Restore state from a bitfield
    loadTile(memento, position, scene) {
        this.cleanTile()
        const decoded = this.decodeTileData(memento)
        this.sunLvl = decoded[bitDetailsIndex.LIGHT_LEVEL]
        this.waterLvl = decoded[bitDetailsIndex.WATER_LEVEL]
        // Map back to your plant system if necessary
        if (decoded[bitDetailsIndex.SPECIES] > 0) {
            this.plant = this.gameManager.plantManager.addPlant(
                
                position,
                decoded[bitDetailsIndex.SPECIES],
                decoded[bitDetailsIndex.GROWTH_LEVEL],
            )
        }
    }

    encodeTileData(lightLevel, waterLevel, species, growthLevel) {
        let data = 0
        const tileData = [lightLevel, waterLevel, species, growthLevel]
        for (let i = 0; i < tileData.length; i++) {
            data |= (tileData[i] & bitLayout[i].mask) << bitLayout[i].shift
        }
        return data
    }

    decodeTileData(data) {
        let decoded = []
        for (let i = 0; i < bitLayout.length; i++) {
            decoded.push((data >> bitLayout[i].shift) & bitLayout[i].mask)
        }
        return decoded
    }
}

class GridObj extends Phaser.GameObjects.Sprite {
    constructor(gameManager, position, texture) {
        const trueX = position.x * gameManager.tileSize
        const trueY = position.y * gameManager.tileSize
        super(gameManager.scene, trueX, trueY, texture)

        this.gameManager = gameManager
        this.world = gameManager.world
        this.scene = gameManager.scene
        this.position = position.copy()
        this.scene.add.existing(this)
        this.setOrigin(0)
    }

    teleport(target){
        if (!this.world.checkEnterable(target)) {
            return false
        }
        this.position = target
        this.x = this.position.x * this.world.tileSize
        this.y = this.position.y * this.world.tileSize
        return true
    }


}

class World {
    constructor(gameManager, gridSize, tileSize) {
        this.scene = gameManager.scene

        this.gameManager = gameManager
        this.height = gridSize.height
        this.width = gridSize.width
        this.tileSize = tileSize

        this.gridSize = gridSize
        this.grid = []

        // render blank state
        for (let x = 0; x < this.gridSize.width; x++) {
            this.grid[x] = []
            for (let y = 0; y < this.gridSize.height; y++) {
                this.grid[x][y] = new Tile(this.gameManager)

                const index = this.#getRandomIndex()
                this.#renderTile(x, y, index)
            }
        }
    }

    exportWorldInstance() {
        const bytesForTime = 2;
        const bytesForPos = 1;
        let requiredbytes = (this.width * this.height) + bytesForTime + bytesForPos;

        const byteAr = new Uint16Array(requiredbytes)
        let visitedTiles = 0;
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                byteAr[visitedTiles] = this.grid[i][j].saveTile()
                visitedTiles++;
            }
        }
        
        const playerPos = this.gameManager.player.position;
        const currentTime = this.gameManager.time;
        
        const posBytes = (playerPos.x << 8) | (playerPos.y)
        const timeBytes =  (currentTime.hour << 8) | currentTime.day
        
        const extraBytes = [posBytes, timeBytes]
        byteAr[visitedTiles + 1] =  posBytes;
        byteAr[visitedTiles + 2] =  timeBytes;
        return byteAr
    }


    loadWorldInstance(data) {
        let visitedTiles = 0
        for (let i = 0; i < this.width; i++) {
            for (let j = 0; j < this.height; j++) {
                this.grid[i][j].loadTile(data[visitedTiles], new Vector(i, j), this.scene)
                visitedTiles++
            }
        }
        const initialPlayerPos = new Vector(data[visitedTiles + 1] >> 8, data[visitedTiles + 1] & calculateMask(8))
        this.gameManager.player.teleport(initialPlayerPos)
        const initialTime = {hour: data[visitedTiles + 2] >> 8, day: data[visitedTiles + 2] & calculateMask(8)};
        this.gameManager.time = initialTime
    }

    checkEnterable(pos) {
        const tile = this.getTile(pos)
        return tile != null
    }

    checkPlantable(pos) {
        const tile = this.getTile(pos)
        return tile && !tile.plant
    }

    addPlant(pos, obj) {
        const tile = this.getTile(pos)
        tile && !tile.plant && (tile.plant = obj)
    }

    removePlant(pos) {
        const tile = this.getTile(pos)

        if (tile && tile.plant) {
            tile.plant.destroy()
            tile.plant = null
            return true;
        }
    }

    generateRandomWeather() {
        for (let x = 0; x < this.gridSize.width; x++) {
            for (let y = 0; y < this.gridSize.height; y++) {
                const tile = this.getTile(new Vector(x, y))
                //water level can be stored up, sun level cannot per F0.d
                tile.waterLvl = tile.waterLvl + Math.floor(Math.random() * 3)
                tile.sunLvl = Math.floor(Math.random() * 3)
            }
        }
    }

    getTile(pos) {
        const grid = this.grid
        return (grid && this.grid[pos.x] && this.grid[pos.x][pos.y]) || null
    }

    #getRandomIndex(key = 'grass-spritesheet') {
        const texture = this.scene.textures.get(key)

        assert(texture.key != '__MISSING')

        return Phaser.Math.Between(0, texture.frameTotal - 2)
    }

    #renderTile(x, y, index, key = 'grass-spritesheet') {
        const trueX = x * this.tileSize + this.tileSize / 2
        const trueY = y * this.tileSize + this.tileSize / 2

        const tileSprite = this.scene.add.sprite(trueX, trueY, key, index)
        tileSprite.setDisplaySize(this.tileSize, this.tileSize).setOrigin(0.5)
    }
}

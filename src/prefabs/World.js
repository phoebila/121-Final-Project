class Tile {
    constructor(plant = null, waterLvl = 0, sunLvl = 0) {
        this.plant = plant // Plant reference
        this.waterLvl = waterLvl
        this.sunLvl = sunLvl
    }
    

    // Encode the current state into a bitfield
    saveMe() {
        const species = this.plant ? this.plant.species : 0
        const growthLevel = this.plant ? this.plant.growthLevel : 0
        return this.encodeTileData(this.sunLvl, this.waterLvl, species, growthLevel)
    }


    cleanMe(){
        this.plant && this.plant.destroy()
        this.sunLvl = 0;
        this.waterLvl = 0;
    }

    // Restore state from a bitfield
    loadMe(memento, position, scene) {
        this.cleanMe();

        const decoded = this.decodeTileData(memento)
        this.sunLvl = decoded[bitDetailsIndex.LIGHT_LEVEL]
        this.waterLvl = decoded[bitDetailsIndex.WATER_LEVEL]
        // Map back to your plant system if necessary
        if (decoded[bitDetailsIndex.SPECIES] > 0) {
            this.plant = new Plant(scene, position, scene.world, decoded[bitDetailsIndex.SPECIES])
            this.plant.setGrowth(decoded[bitDetailsIndex.GROWTH_LEVEL])
        }
        return this
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

        this.gameManager = gameManager;
        this.world = gameManager.world;
        this.scene = gameManager.scene;
        this.position = position.copy()
        this.scene.add.existing(this)
        this.setOrigin(0)
    }
}

class World {
    constructor(scene, gridSize, tileSize) {
        this.height = gridSize.height
        this.width = gridSize.width
        this.tileSize = tileSize
        this.gridSize = gridSize
        this.scene = scene
        this.grid = []
        this.gameState = new WinConManager()

        for (let x = 0; x < this.gridSize.width; x++) {
            this.grid[x] = []
            for (let y = 0; y < this.gridSize.height; y++) {
                this.grid[x][y] = new Tile()

                const index = this.getRandomIndex()
                this.renderTile(x, y, index)
            }
        }
    }


    // PUBLIC FUNCTIONS
    checkEnterable(pos){
        const tile = this.getTile(pos)
        return (tile != null)
    }

    checkPlantable(pos){
        const tile = this.getTile(pos)
        return(tile && !tile.plant);
    }

    addPlant(pos,obj){
        const tile = this.getTile(pos);
        tile && !tile.plant && (tile.plant = obj);
    }

    removePlant(pos){
        const tile = this.getTile(pos)
        
        if (tile && tile.plant){
            tile.plant.destroy();
            tile.plant = null
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




    
    // PRIVATE FUNCTIONS
    getRandomIndex(key = 'grass-spritesheet') {
        const texture = this.scene.textures.get(key)

        assert(texture.key != '__MISSING')

        return Phaser.Math.Between(0, texture.frameTotal - 2)
    }

    renderTile(x, y, index, key = 'grass-spritesheet') {
        const trueX = x * this.tileSize + this.tileSize / 2
        const trueY = y * this.tileSize + this.tileSize / 2

        const tileSprite = this.scene.add.sprite(trueX, trueY, key, index)
        tileSprite.setDisplaySize(this.tileSize, this.tileSize).setOrigin(0.5)
    }

    getTile(pos) {
        const grid = this.grid
        return (grid && this.grid[pos.x] && this.grid[pos.x][pos.y]) || null
    }

}

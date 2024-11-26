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

    // Restore state from a bitfield
    loadMe(memento, position, scene) {
        this.plant && this.plant.destroy()
        console.log(memento.toString(2))

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
    constructor(scene, position, world, texture) {
        const trueX = position.x * world.tileSize
        const trueY = position.y * world.tileSize
        super(scene, trueX, trueY, texture)

        this.position = position.copy()
        this.world = world
        this.tags = []
        this.world.popTile(this.position, this)
        this.walking = false

        scene.add.existing(this)

        this.setOrigin(0)
    }

    move(dir) {
        const target = this.position.add(dir)
        if (!this.world.checkEnterable(target, this)) {
            return false
        }

        this.walking = true
        const startingPosition = this.position.copy()
        this.world.popTile(target, this)
        this.position = target
        this.x = this.position.x * this.world.tileSize
        this.y = this.position.y * this.world.tileSize
        this.world.dePopTile(startingPosition, this)
        this.walking = false
        return true
    }
}

class World {
    constructor(scene, height, width, tileSize) {
        this.height = height
        this.width = width
        this.tileSize = tileSize
        this.gridSize = new Vector(width, height)
        this.scene = scene
        this.grid = []
        this.gameState = new GameState()

        for (let x = 0; x < this.gridSize.x; x++) {
            this.grid[x] = []
            for (let y = 0; y < this.gridSize.y; y++) {
                this.grid[x][y] = new Tile()

                const index = this.getRandomIndex()
                this.renderTile(x, y, index)
            }
        }

        this.time = {
            day: 0,
            hour: 0,
        }

        //this.lightState
    }

    tick(hour, day) {
        // do not allow a time incrament of more than a day (in hours)
        assert(hour < 24)

        this.time.hour += hour
        if (this.time.hour >= 24) {
            const newTime = { day: 0, hour: 0 }
            newTime.hour = this.time.hour % 24
            newTime.day = this.time.day + Math.floor(this.time.hour / 24)
            this.time = newTime
        }
        this.time.day += day

        this.printTime()

        console.log(this.grid[0][0].waterLvl)
        this.generateRandomWeather()

        // update light state
        this.gameState.totalPlants.forEach(value => {
            value.tick()
        })
        if (this.gameState.checkWinCondition()) {
            console.log('GAME WON')
        }
    }

    getTime() {
        return this.time
    }

    printTime() {
        console.log(`day: ${this.time.day}, hour: ${this.time.hour}`)
    }

    // PUBLIC FUNCTIONS

    popTile(pos, obj) {
        if (obj instanceof Player && this.checkEnterable(pos, obj)) {
            this.getTile(pos).character = obj
        } else if (obj instanceof Plant && this.checkEnterable(pos, obj)) {
            this.getTile(pos).plant = obj
        }
    }

    dePopTile(pos, obj) {
        if (obj instanceof Player) {
            const tile = this.getTile(pos)
            if (tile) {
                tile.character = null
            }
        } else if (obj instanceof Plant) {
            const tile = this.getTile(pos)
            if (tile) {
                tile.plant = null
            }
        }
    }

    generateRandomWeather() {
        for (let x = 0; x < this.gridSize.x; x++) {
            for (let y = 0; y < this.gridSize.y; y++) {
                const tile = this.getTile(new Vector(x, y))
                //water level can be stored up, sun level cannot per F0.d
                tile.waterLvl = tile.waterLvl + Math.floor(Math.random() * 3)
                tile.sunLvl = Math.floor(Math.random() * 3)
            }
        }
    }

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

    // PRIVATE FUNCTIONS
    getTile(pos) {
        const grid = this.grid
        return (grid && this.grid[pos.x] && this.grid[pos.x][pos.y]) || null
    }

    checkEnterable(pos, obj) {
        if (obj instanceof Player && this.checkCharacterEnter(pos, obj)) {
            return true
        } else if (obj instanceof Plant && this.checkPlantable(pos, obj)) {
            return true
        }
        return false
    }

    checkPlantable(pos) {
        const tile = this.getTile(pos)
        if (tile && !tile.plant) {
            return true
        }
        return false
    }

    checkCharacterEnter(pos, obj) {
        const tile = this.getTile(pos)
        if (tile && !tile.character) {
            return true
        }
        return false
    }
}

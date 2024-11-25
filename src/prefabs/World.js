class Vector {
    constructor(x = 0, y = 0) {
        this.x = x
        this.y = y
    }

    add(other) {
        return new Vector(this.x + other.x, this.y + other.y)
    }

    minus(other) {
        return new Vector(this.x - other.x, this.y - other.y)
    }

    copy() {
        return new Vector(this.x, this.y)
    }
    stringify() {
        return this.x.toString() + ':' + this.y.toString()
    }
}


const BIT_LAYOUT = {
    LIGHT_LEVEL: { shift: 0, bits: 2 },  // First 2 bits
    WATER_LEVEL: { shift: 2, bits: 2 }, // Next 2 bits
    PLANT_TYPE: { shift: 4, bits: 3 },  // Next 2 bits
    PLANT_LEVEL: { shift: 7, bits: 2 }, // Next 2 bits
};
function calculateMask (bits) {
    return (1 << bits ) - 1
}

Object.keys(BIT_LAYOUT).forEach((key) => {
    BIT_LAYOUT[key].mask = calculateMask(BIT_LAYOUT[key].bits);
});

class Tile {
    constructor(plant = null, waterLvl = 0, sunLvl = 0) {
        this.plant = plant; // Plant reference
        this.waterLvl = waterLvl;
        this.sunLvl = sunLvl;
    }
    


    // Encode the current state into a bitfield
    saveMe() {
        const plantType = this.plant ? this.plant.species : 0;
        const plantLevel = this.plant ? this.plant.growthLevel : 0;
        //console.log("Light Level:", this.sunLvl, "Water Level:", this.waterLvl, "Plant Type:", plantType, "Plant Level:", plantLevel);
        return this.encodeTileData(this.sunLvl, this.waterLvl, plantType, plantLevel);
    }
    

    // Restore state from a bitfield
    loadMe(memento, position, scene) {
        // this.plant && this.plant.destroy();
        console.log(memento.toString(2))

        const decoded = this.decodeTileData(memento);
        this.sunLvl = decoded.lightLevel;
        this.waterLvl = decoded.waterLevel;
        // Map back to your plant system if necessary
        if (decoded.plantLevel > 0){
            this.plant = new Plant(scene,position, scene.world,  decoded.species)
            this.plant.setGrowth(decoded.growthLevel)
        }
        
        
        
        
        return(this)
    }


    encodeTileData(lightLevel, waterLevel, species, growthLevel) {
        let data = 0;
        data |= (lightLevel ) << BIT_LAYOUT.LIGHT_LEVEL.shift;
        data |= (waterLevel) << BIT_LAYOUT.WATER_LEVEL.shift;
        data |= (species) << BIT_LAYOUT.PLANT_TYPE.shift;
        data |= (growthLevel ) << BIT_LAYOUT.PLANT_LEVEL.shift;
        return data;
    }
    decodeTileData(data) {
        return {
            lightLevel: (data >> BIT_LAYOUT.LIGHT_LEVEL.shift) & 3,
            waterLevel: (data >> BIT_LAYOUT.WATER_LEVEL.shift) &  3,
            species: (data >> BIT_LAYOUT.PLANT_TYPE.shift) &  7,
            growthLevel: (data >> BIT_LAYOUT.PLANT_LEVEL.shift) &  3,
        };
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
    constructor(scene, width, height, tileSize) {
        this.width = width
        this.height = height
        this.tileSize = tileSize
        this.gridSize = new Vector(width, height)
        this.scene = scene
        this.grid = []
        this.gameState = new GameState()

        for (let x = 0; x < this.gridSize.y; x++) {
            this.grid[x] = []
            for (let y = 0; y < this.gridSize.x; y++) {
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
        if (obj instanceof Player) {
            this.addCharacter(pos, obj)
        } else if (obj instanceof Plant) {
            this.addPlant(pos, obj)
        }
    }

    dePopTile(pos, obj) {
        if (obj instanceof Player) {
            this.removeCharacter(pos)
        } else if (obj instanceof Plant) {
            this.removePlant(pos)
        }
    }

    // Can be used, but popTile and dePopTile recommended

    addPlant(pos, obj) {
        if (this.checkEnterable(pos, obj)) {
            this.getTile(pos).plant = obj
        }
    }

    addCharacter(pos, obj) {
        if (this.checkEnterable(pos, obj)) {
            this.getTile(pos).character = obj
        }
    }

    removeCharacter(pos) {
        const tile = this.getTile(pos)
        if (tile) {
            tile.character = null
        }
    }

    removePlant(pos) {
        const tile = this.getTile(pos)
        if (tile) {
            tile.plant = null
        }
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

    // didnt want to move this but i think its public
    generateRandomWeather() {
        for (let y = 0; y < this.gridSize.y; y++) {
            for (let x = 0; x < this.gridSize.x; x++) {
                const tile = this.getTile(new Vector(x, y))
                //water level can be stored up, sun level cannot per F0.d
                tile.waterLvl = tile.waterLvl + Math.floor(Math.random() * 3)
                tile.sunLvl = Math.floor(Math.random() * 3)
            }
        }
    }

    generateWeather(waterLvl, sunLvl) {
        for (let y = 0; y < this.gridSize.y; y++) {
            for (let x = 0; x < this.gridSize.x; x++) {
                let tile = this.getTile(new Vector(x, y))
                tile.waterLvl += waterLvl
                tile.sunLvl = sunLvl
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
}

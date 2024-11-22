class Vector {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

    add(other) {
        return new Vector(this.x + other.x, this.y + other.y);
    }

    minus(other) {
        return new Vector(this.x - other.x, this.y - other.y);
    }

    copy() {
        return new Vector(this.x, this.y);
    }
}

class Tile {
    constructor(plant = null, waterLvl = 0, sunLvl = 0) {
        this.plant = null;
        this.character = null;
        this.waterLvl = waterLvl;
        this.sunLvl = sunLvl;
    }

    // Check if the tile is free for planting (ignoring the player)
    isFreeForPlanting() {
        return this.plant === null; // Free if no plant is present
    }

    // Link a plant to this tile
    linkPlant(plant) {
        if (this.isFreeForPlanting()) {
            console.log('Linking plant to tile');
            this.plant = plant; // Set the plant reference
        } else {
            console.warn('Cannot link plant, tile is already occupied by a plant');
        }
    }

    // Unlink the plant from this tile
    unlinkPlant() {
        if (this.plant) {
            console.log('Unlinking plant from tile');
            this.plant = null;  // Clear the plant reference
        }
    }

    // Clear the tile entirely (plant and other objects)
    clearTile() {
        console.log('Clearing tile');
        this.plant = null;
        this.obj = null;
    }
}



class GridObj extends Phaser.GameObjects.Sprite {
    constructor(scene, position, world, texture) {
        const trueX = position.x * world.tileSize;
        const trueY = position.y * world.tileSize;
        super(scene, trueX, trueY, texture);

        this.position = position.copy();
        this.world = world;
        this.tags = [];
        this.world.popTile(this.position, this)
        this.walking = false;

        scene.add.existing(this);
    }

    move(dir) {
        const target = this.position.add(dir);
        if (!this.world.checkEnterable(target, this)) {
            return false;
        }
        
        this.walking = true
        const startingPosition = this.position.copy();
        this.world.popTile(target, this);
        this.position = target
        this.x = this.position.x * this.world.tileSize;
        this.y = this.position.y * this.world.tileSize;
        this.world.dePopTile(startingPosition, this);
        this.walking = false;
        return true;
    }

    
}

class World {
    constructor(scene, width, height, tileSize) {
        this.tileSize = tileSize;
        this.gridSize = new Vector(width, height);
        this.scene = scene;
        this.grid = [];

        // Initialize grid with Tile objects
        for (let x = 0; x < this.gridSize.x; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.gridSize.y; y++) {
                this.grid[x][y] = new Tile();
            }
        }
    }


    // PUBLIC FUNCTIONS

    popTile(pos, obj){
        if (obj instanceof Player){
            this.addCharacter(pos,obj)
        } else if (obj instanceof Plant){
            this.addPlant(pos,obj)
        }
    }


    dePopTile(pos,obj){
        if (obj instanceof Player){
            this.removeCharacter(pos)
        } else if (obj instanceof Plant){
            this.removePlant(pos)
        }
    }



    // Can be used, but popTile and dePopTile recommended

    addPlant(pos, obj){
        if (this.checkEnterable(pos, obj)) {
            this.getTile(pos).plant = obj;
        }
    }

    addCharacter(pos, obj){
        if (this.checkEnterable(pos,obj)) {
            this.getTile(pos).character = obj;
        }
    }


    
    removeCharacter(pos){
        const tile = this.getTile(pos);
        if (tile){
            tile.character = null;
        }
        
    }

    removePlant(pos){
        const tile = this.getTile(pos);
        if (tile){
            tile.plant = null;
        }
    }

    // PRIVATE FUNCTIONS
    getTile(pos) {
        const grid = this.grid;
        return (grid && this.grid[pos.x] && this.grid[pos.x][pos.y]) || null;
    }


    checkEnterable(pos, obj){
       if ( obj instanceof Player && this.checkCharacterEnter(pos,obj)){
            return true;
        } else if (obj instanceof Plant && this.checkPlantable(pos,obj)){
            return true;
        }
        return false;
    }


    checkPlantable(pos){
        const tile = this.getTile(pos);
        if (tile && !tile.plant){
            return true;
        }
        return false;
    }


    checkCharacterEnter(pos, obj){
        const tile = this.getTile(pos);
        if (tile && !tile.character){
            return true;
        }
        return false;
    }

    // didnt want to move this but i think its public
    generateRandomWeather(){
        for (let y = 0; y < this.gridSize.y; y++) {
            for (let x = 0; x < this.gridSize.x; x++) {
                const tile = this.getTile(new Vector(x, y));
                tile.waterLvl += Math.random();
                tile.sunLvl = Math.random();
            }
        }
    }

}

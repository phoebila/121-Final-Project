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
        this.isOccupiedByPlant = false;  // Property to track if the tile is occupied by a plant
    }

    // Helper method to check if tile is free to use
    isFreeForPlanting() {
        // A tile is free for planting if it contains no object, and it is not occupied by a plant
        return !this.obj && !this.isOccupiedByPlant;
    }

    // Mark this tile as occupied by a plant
    markAsOccupiedByPlant() {
        this.isOccupiedByPlant = true;
    }

    // Remove the plant and free up the tile
    clearTile() {
        this.isOccupiedByPlant = false;
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
        this.world.popTile(this.position, this)
        this.walking = false;

        scene.add.existing(this);
    }

    move(dir) {
        const target = this.position.add(dir);
        this.walking = true
        if (!this.world.checkEnterable(target)) {
            this.walking = false;
            return false;
        }
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
        // Fixed grid initialization
        for (let x = 0; x < this.gridSize.x; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.gridSize.y; y++) {
                this.grid[x][y] = new Tile();
            }
        }
    }


    // PUBLIC FUNCTIONS
    popTile(pos, obj){
        if (typeof obj === "Character"){
            this.addCharacter(pos,obj)
        } else if (typeof obj === "Plant"){
            this.addPlant(pos,obj)
        }
    }


    dePopTile(pos,obj){
        if (typeof obj === "Character"){
            this.removeCharacter(pos)
        } else if (typeof obj === "Plant"){
            this.removePlant(pos)
        }
    }



    // Can be used, but popTile and dePopTile recommended

    addPlant(pos, arg){
        if (this.checkPlantable(pos)) {
            this.getTile(pos).plant = arg;
        }
    }

    addCharacter(pos, arg){
        if (this.checkEnterable(pos)) {
            this.getTile(pos).plant = arg;
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

    checkPlantable(pos){
        const tile = this.getTile(pos);
        if (tile && !tile.plant){
            return true;
        }
        return null;
    }

    checkEnterable(pos){
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

    // Check if a position is within a certain range of the player (for interaction)
    isWithinProximity(playerPos, targetPos, range) {
        const distance = Math.abs(playerPos.x - targetPos.x) + Math.abs(playerPos.y - targetPos.y);
        return distance <= range;
    }
}

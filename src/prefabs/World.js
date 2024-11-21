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
    constructor(obj = null, waterLvl = 0, sunLvl = 0) {
        this.obj = obj;  // Tracks any object on the tile (could be Player, GridObj, etc.)
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
        this.gridPosition = position.copy();
        this.world.popTile(this.gridPosition, this);
        this.walking = false;

        scene.add.existing(this);
    }

    move(dir) {
        const target = this.gridPosition.add(dir);
        this.walking = true;
        if (!this.world.checkEnterable(target)) {
            this.walking = false;
            return false;
        }
    
        // Clear the old position first
        const startingPosition = this.gridPosition.copy();
        this.world.dePopTile(startingPosition); // Remove the player from the old position
        
        // Place the player in the new position
        this.world.popTile(target, this); // Add the player to the new position
        this.gridPosition = target.copy();
        this.x = this.gridPosition.x * this.world.tileSize;
        this.y = this.gridPosition.y * this.world.tileSize;
    
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

    getTile(pos) {
        if (
            pos.x >= 0 &&
            pos.x < this.gridSize.x &&
            pos.y >= 0 &&
            pos.y < this.gridSize.y
        ) {
            return this.grid[pos.x][pos.y] || null;
        }
        return null;
    }

    // Place the object (e.g., flower) on the tile
    popTile(position, obj) {
        const tile = this.getTile(position);
        
        if (!tile) {
            console.log(`No tile found at (${position.x}, ${position.y})`);
            return;
        }
        
        // Check if the tile is free for planting
        if (tile.isFreeForPlanting()) {
            console.log(`Placing object at (${position.x}, ${position.y})`);
            tile.obj = obj;  // Place the object (e.g., plant)
            tile.markAsOccupiedByPlant(); // Mark the tile as occupied by a plant
        } else {
            console.log(`Tile at (${position.x}, ${position.y}) is not free, cannot place plant.`);
        }
    }
    
    // Remove the object from the tile
    dePopTile(pos) {
        const tile = this.getTile(pos);
        if (tile) {
            tile.clearTile();  // Reset the tile's object and occupation status
            console.log(`Removing object from (${pos.x}, ${pos.y})`);
        } else {
            console.error(`Attempted to depop a tile at invalid position: (${pos.x}, ${pos.y})`);
        }
    }

    checkEnterable(pos) {
        const tile = this.getTile(pos);
        if (!tile) {
            console.log(`Tile at (${pos.x}, ${pos.y}) does not exist.`);
            return false;
        }
    
        // Allow movement if the tile is empty or occupied by the player or a plant
        if (tile.obj && tile.obj !== this.player) {
            console.log(`Tile at (${pos.x}, ${pos.y}) is occupied by: ${tile.obj}`);
            return false;
        }
    
        // Tile is free to use
        return true;
    }

    // Generate random weather (water and sun levels) for each tile
    generateRandomWeather() {
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

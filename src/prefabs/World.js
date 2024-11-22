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
        this.obj = obj;         // Can be the player or another non-plant object
        this.plant = null;      // Reference to the plant object (if any)
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

        // Clear the old position first, but DO NOT free the tile
        const startingPosition = this.gridPosition.copy();
        this.world.dePopTile(startingPosition); // Remove the player from the old position (without clearing tile)
        
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

        // Initialize grid with Tile objects
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

    // Check if the tile is enterable by the player
    checkEnterable(position) {
        const tile = this.getTile(position);
        if (tile && !tile.isOccupiedByPlant && tile.obj === null) {
            return true;  // Tile is enterable if it's free and not occupied by a plant or object
        }
        return false;  // Tile is not enterable if occupied
    }

    // Place the object (e.g., player or plant) on the tile if it's free
    popTile(position, obj) {
        const tile = this.getTile(position);

        if (!tile) {
            console.log(`No tile found at (${position.x}, ${position.y})`);
            return;
        }

        // Only place an object if the tile is free (not occupied by a plant or any other object)
        if (tile.isFreeForPlanting()) {
            console.log(`Placing object at (${position.x}, ${position.y})`);
            tile.obj = obj;
            if (obj instanceof Plant) {
                tile.markAsOccupiedByPlant();
            }
        }
    }

    // Remove object (clear the tile) but do not reset occupation status
    dePopTile(position) {
        const tile = this.getTile(position);
        if (tile) {
            tile.obj = null;  // Just remove the object, but do not clear the plant occupation status
        }
    }
}

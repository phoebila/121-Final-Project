class Player extends GridObj {
    constructor(scene, position, sprite) {
        super(scene, position, scene.world, sprite);
        this.waitTime = 200;
        this.timer = 0;
        this.tags.push("Character")
        this.tags.push("Player")
    }

    update(time, delta) {
        // Listen for inputs and move the player
        if (this.timer <= 0) {
            if (cursors.left.isDown) {
                this.move(new Vector(-1, 0));
            } else if (cursors.down.isDown) {
                this.move(new Vector(0, 1));
            } else if (cursors.up.isDown) {
                this.move(new Vector(0, -1));
            } else if (cursors.right.isDown) {
                this.move(new Vector(1, 0));
            }
        } else {
            this.timer -= delta;
        }
    }

    move(dir) {
        super.move(dir);
        this.timer = this.waitTime;
    }

    sow() {
        const playerPos = this.gridPosition;
        const tile = this.scene.world.getTile(playerPos);
    
        console.log(`Sowing plant at (${playerPos.x}, ${playerPos.y})`);
    
        if (tile && tile.isFreeForPlanting()) {
            console.log('Tile is free, sowing plant.');
    
            // Create the plant object (e.g., flower)
            const flower = new GridObj(this.scene, playerPos, this.scene.world, "flower");
            flower.anims.play('flower'); // Play the flower animation
    
            // Link the flower to the tile
            tile.linkPlant(flower);
    
            console.log(`Planted a flower at (${playerPos.x}, ${playerPos.y})`);
        } else {
            console.log('Tile is not free, cannot plant.');
        }
    }
    

    reap() {
        const nearbyTile = this.getNearbyTileForAction();
    
        if (nearbyTile && nearbyTile.plant) {
            const plant = nearbyTile.plant;  // Get the plant reference
            const position = plant.gridPosition || nearbyTile.gridPosition; // Fallback to tile position if needed
            
            console.log(`Reaping plant from (${position.x}, ${position.y})`);
    
            // Destroy the visual representation and unlink the plant
            plant.destroy(); // Destroy the flower object
            nearbyTile.unlinkPlant(); // Remove the plant from the tile
    
            console.log(`Successfully reaped the plant at (${position.x}, ${position.y})`);
        } else {
            console.log('No valid plant nearby to reap.');
        }
    }

    getNearbyTileForAction() {
        const nearbyTiles = [];
        const playerPos = this.gridPosition;
    
        console.log(`Player Position: (${playerPos.x}, ${playerPos.y})`);
    
        for (let dx = -this.scene.interactionRange; dx <= this.scene.interactionRange; dx++) {
            for (let dy = -this.scene.interactionRange; dy <= this.scene.interactionRange; dy++) {
                const targetPos = new Vector(playerPos.x + dx, playerPos.y + dy);
                const tile = this.world.getTile(targetPos);
    
                if (tile && tile.plant) {  // Only consider tiles with valid plants
                    nearbyTiles.push(tile);
                    console.log(`Found plant at (${targetPos.x}, ${targetPos.y})`);
                } else {
                    // console.log(`No plant at (${targetPos.x}, ${targetPos.y})`);
                }
            }
        }
    
        console.log(`Nearby tiles with plants: ${nearbyTiles.length}`);
        return nearbyTiles[0] || null; // Return the first valid tile with a plant
    }
    
}

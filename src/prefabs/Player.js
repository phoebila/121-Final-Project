class Player extends GridObj {
    constructor(scene, position, sprite) {
        super(scene, position, scene.world, sprite);
        this.waitTime = 200;
        this.timer = 0;
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
            console.log(`Reaped a plant from (${nearbyTile.gridPosition.x}, ${nearbyTile.gridPosition.y})`);

            // Destroy the visual representation and unlink the plant from the tile
            nearbyTile.plant.destroy();  // Destroy the flower object
            nearbyTile.unlinkPlant();   // Use a method in Tile to remove the plant and free the tile

            console.log(`Reaped a plant at (${nearbyTile.gridPosition.x}, ${nearbyTile.gridPosition.y})`);
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

                if (tile && (targetPos.x !== playerPos.x || targetPos.y !== playerPos.y)) {
                    if (tile.plant) {  // Check if the tile contains a plant
                        nearbyTiles.push(tile); // Only add tile with plant for reaping
                    }
                }
            }
        }

        console.log(`Nearby tiles with plants: ${nearbyTiles.length}`);
        return nearbyTiles[0] || null; // Return the first valid tile with a plant
    }
}

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
        console.log(`Tile at position (${playerPos.x}, ${playerPos.y}) contains:`, tile.obj);

        if (tile) {
            // Check if the tile is free for planting
            if (tile.isFreeForPlanting()) {
                console.log('Tile is free, sowing plant.');

                // Create the plant object (assuming Plant is a valid class)
                const plant = new Plant();  // Create a new plant (you can customize this as needed)

                // Place the plant on the tile
                tile.placePlant(plant);  // This method places the plant and marks the tile as occupied

                // Optionally: Visualize the plant in the scene (e.g., using an animation or sprite)
                const flower = new GridObj(this.scene, playerPos, this.scene.world, "flower");
                flower.anims.play('flower'); // Play the flower animation
                tile.obj = flower;  // Assign the flower sprite to the tile

                console.log(`Planted a flower at (${playerPos.x}, ${playerPos.y})`);
            } else {
                console.log('Tile is not free, cannot plant (occupied by another object).');
            }
        }
    }

    reap() {
        const nearbyTile = this.getNearbyTileForAction();
        if (nearbyTile && nearbyTile.plant) {
            console.log(`Reaped a plant from (${nearbyTile.gridPosition.x}, ${nearbyTile.gridPosition.y})`);

            // Remove the plant from the tile
            nearbyTile.plant = null;  // Remove the plant from the tile
            nearbyTile.isOccupiedByPlant = false;  // Free the tile for future planting
            nearbyTile.obj.destroy();  // Destroy the plant's visual representation (if any)
            nearbyTile.obj = null;  // Remove the visual representation from the tile

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

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
            // Check if the tile is free for planting by ensuring it's not occupied by a plant
            if (!tile.obj || !(tile.obj instanceof Plant)) {
                console.log('Tile is free, sowing plant.');

                // Mark the tile as occupied by the player
                tile.isOccupiedByPlayer = true; // Player occupies the tile while planting

                // Create and place the flower (GridObj with 'flower' animation)
                const flower = new GridObj(this.scene, playerPos, this.scene.world, "flower");
                flower.anims.play('flower'); // Play the flower animation

                // Place the flower on the tile
                tile.obj = flower;  // Directly place the flower on the tile

                console.log(`Planted a flower at (${playerPos.x}, ${playerPos.y})`);
            } else {
                console.log('Tile is not free, cannot plant (occupied by another object).');
            }
        }
    }

    reap() {
        const nearbyTile = this.getNearbyTileForAction();
        if (nearbyTile && nearbyTile.obj instanceof Plant) {
            console.log(`Reaped a plant from (${nearbyTile.position.x}, ${nearbyTile.position.y})`);

            // Remove the plant from the tile
            nearbyTile.obj.destroy();
            nearbyTile.obj = null;
            nearbyTile.isOccupiedByPlant = false;  // Free the tile for future planting
            nearbyTile.isOccupiedByPlayer = false; // Ensure the player no longer occupies the tile

            console.log(`Reaped a plant at (${nearbyTile.position.x}, ${nearbyTile.position.y})`);
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
                    if (tile.obj instanceof Plant) {
                        nearbyTiles.push(tile); // Only add tile with plant for reaping
                    }
                }
            }
        }

        console.log(`Nearby tiles with plants: ${nearbyTiles.length}`);
        return nearbyTiles[0] || null; // Return the first valid tile with a plant
    }
}

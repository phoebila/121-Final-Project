class Player extends GridObj {
    constructor(scene, position, sprite) {
        super(scene, position, scene.world, sprite);
        this.waitTime = 200;
        this.timer = 0;

        this.setOrigin(0)
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
            } else if (space.isDown){
                this.sowPlant()
            } else if (eKey.isDown){
                this.reap()
            }
        } else {
            this.timer -= delta;
        }
    }

    move(dir) {
        super.move(dir);
        this.timer = this.waitTime;
    }


    //////////
    sowPlant() {
        const playerPos = this.position;
        // If tile is free or contains the player, sow the plant
        if (this.world.checkPlantable(playerPos)) {
            // Create and place the plant without removing the player
            const plant = new Plant(this.scene, playerPos, this.world);
            
        }
    }
    // Increment world time 
        // Change state of weather on the grid
        // Increment / Deincrement water levels
        // Add / Remove sunlit status
    tick() {
        
    }
    

    reap() {
        const targetPos = this.position
        const plant = this.world.getTile(targetPos).plant
        this.world.dePopTile(targetPos, plant);
        if (plant){
            this.world.gameState.removePlantFromState(this);
            plant.destroy()
        }
    }

    getNearbyTileForAction() {
        const nearbyTiles = [];
        const playerPos = this.position;
    
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

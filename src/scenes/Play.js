class Play extends Phaser.Scene {
    constructor() {
        super('playScene');
    }

    init() {
        this.BUTTON_LAYER = 100;
        this.TILE_SIZE = 8;
        this.interactionRange = 3; // Player must be within 3 tiles
    }

    create() {
        // running checks
        console.log('%cPLAY SCENE :^)', testColor);

        this.tickButton = this.constructButton(this.TILE_SIZE, this.TILE_SIZE, 10, 6, 'press to tick time', this.moveTime);

        // Add grid
        // Add player to grid
        this.world = new World(this, 100, 100, 8);
        this.player = new Player(this, new Vector(0, 0), 'player');
        this.obj = new GridObj(this, new Vector(0, 0), this.world, "flower");
        this.cameras.main.startFollow(this.player);
        this.cameras.main.setZoom(4);

        this.obj.anims.play('flower');

        // Input handling
        this.input.keyboard.on('keydown-SPACE', () => this.sowPlant());
        this.input.keyboard.on('keydown-E', () => this.reapPlant());
    }

    update(time, delta) {
        this.player.update(time, delta);
    }

    constructButton(x, y, textSize, padding, text = 'default text', result) {
        const content = this.add.text(x + padding / 2, y + padding / 2, text, { fontSize: `${textSize - 2}px`, lineSpacing: 0 });
        content.height = textSize;
        const UIBox = this.add.rectangle(x, y, Math.ceil((content.width + padding) / this.TILE_SIZE) * this.TILE_SIZE, content.height + padding, 0xff0000);

        content.setOrigin(0).setZ(this.BUTTON_LAYER + 100).setDepth(this.BUTTON_LAYER + 1);
        UIBox.setOrigin(0).setZ(this.BUTTON_LAYER).setDepth(this.BUTTON_LAYER);

        const button = { content, UIBox };
        UIBox.setInteractive().on('pointerdown', result);

        return button;
    }

    moveTime() {
        console.log('peepee');
    }

    sowPlant() {
        const playerPos = this.player.position;
        const tile = this.world.getTile(playerPos);
        if (tile) {
            // If tile is free or contains the player, sow the plant
            if (this.world.checkPlantable(playerPos)) {
    
                // Create and place the plant without removing the player
                const plant = new Plant(this, 1,1, playerPos, this.world, 'flower');
                this.world.popTile(playerPos, plant);  // This will place the plant
            } else {
                console.log('Tile is not free, cannot plant.');
            }
        }
    }

    reapPlant() {
        const position = this.player.position;
        this.world.removePlant(position)


        // if (nearbyTile && nearbyTile.obj instanceof Plant) {
        //     console.log(`Reaped a plant from (${nearbyTile.position.x}, ${nearbyTile.position.y})`);
        //     // Remove the plant from the tile
        //     nearbyTile.obj.destroy();
        //     nearbyTile.obj = null;
        //     console.log(`Reaped a plant at (${nearbyTile.position.x}, ${nearbyTile.position.y})`);
        // } else {
        //     console.log('No valid plant nearby to reap.');
        // }
    }

    getNearbyTileForAction() {
        const nearbyTiles = [];
        const playerPos = this.player.gridPosition;
    
        console.log(`Player Position: (${playerPos.x}, ${playerPos.y})`);
    
        for (let dx = -this.interactionRange; dx <= this.interactionRange; dx++) {
            for (let dy = -this.interactionRange; dy <= this.interactionRange; dy++) {
                const targetPos = new Vector(playerPos.x + dx, playerPos.y + dy);
                const tile = this.world.getTile(targetPos);
    
                if (tile) {
                    console.log(`Tile found at (${targetPos.x}, ${targetPos.y}) - Object:`, tile.obj);
                } else {
                    console.log(`No tile found at (${targetPos.x}, ${targetPos.y})`);
                }
    
                // Ensure player isn't interacting with their own tile and tile must be empty for action
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

// Check that condition is correct, stop program if it isn't
function assert(condition, message) {
    // src = https://stackoverflow.com/questions/15313418/what-is-assert-in-javascript
    if (!condition) {
        throw new Error(message ?? `Assertion failed: condition is ${condition}`);
    }
}

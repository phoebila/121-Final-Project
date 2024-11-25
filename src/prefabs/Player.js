class Player extends GridObj {

    constructor(scene, position, sprite) {
        super(scene, position, scene.world, sprite)
        this.waitTime = 200
        this.timer = 0
        this.direction = new Vector(0,0);

        

        this.setOrigin(0)

        const player = this;
        this.states = [
            {
                name: "idle",
                enter(){
                    //play idle anim
                    player.play('player-idle');
                },
                exit(){},
                update(){
                    const readInput = (direction)=>{
                        player.direction = direction;
                        player.sm.changeState("walk")
                    }
                    if (cursors.left.isDown) {
                        readInput(new Vector(-1,0))
                    } else if (cursors.down.isDown) {
                        readInput(new Vector(0, 1))
                    } else if (cursors.up.isDown) {
                        readInput(new Vector(0, -1))
                    } else if (cursors.right.isDown) {
                        readInput(new Vector(1, 0))
                    } else if (space.isDown) {
                        player.sm.changeState("reap")
                    } else if (eKey.isDown) {
                        player.sm.changeState("sow")
                    } else if (Phaser.Input.Keyboard.JustDown(gKey)){
                        player.sm.changeState("dance")
                    }
                }
            },
            {
                name: "coolDown",
                enter(){
                    // play cool down anim?
                    // wait a few frames then change state back to idle
                    player.sm.changeState("idle")
                },
                exit(){},
                update(){}
            },
            {
                name: "walk",
                enter( ){
                    console.log("entering")
                    player.playAnimation('player-walk', ()=>{
                        player.move();
                        player.sm.changeState("idle")
                    })
                },
                exit(){},
                update(){}
            },
            {
                name: "reap",
                enter(){
                    // play animation then do function on callback
                    player.playAnimation('player-reap', ()=>{
                        player.reap();
                        player.sm.changeState("idle")
                    });
                },
                exit(){},
                update(){}
            },
            {
                name: "sow",
                enter(){
    
                    // play animation then do function on callback
                    player.playAnimation('player-sow', ()=>{
                        player.sowPlant();
                        player.sm.changeState("idle")
                    });
                },
                exit(){},
                update(){}
            },
            {
                name: "dance",
                enter(){
    
                    // play animation then do function on callback
                    player.playAnimation('player-dance', ()=>{});
                },
                exit(){},
                update(){
                    if (!gKey.isDown){
                        player.sm.changeState("idle")
                    }
                }
            }
        ]
        this.setUpSM();
        this.sm.changeState("idle");
    }
    
    
    playAnimation(animation, callback){
        this.play(animation);
        this.once('animationcomplete', ()=>{
            callback && callback();
        }, this.scene); // Use `this` context if needed
    }

    update(time, delta) {
        this.sm.update(time,delta);
    }

    setUpSM(){
        this.sm = new StateMachine(this);
        for (let i of this.states ) {
            this.sm.addState(i);
        }
    }


    move() {
        console.log("moving")
        super.move(this.direction);
    }

    sowPlant() {
        const playerPos = this.position
        // If tile is free or contains the player, sow the plant
        if (this.world.checkPlantable(playerPos)) {
            // Create and place the plant without removing the player
            const plant = new Plant(this.scene, playerPos, this.world)
        }
    }
    // Increment world time
    // Change state of weather on the grid
    // Increment / Deincrement water levels
    // Add / Remove sunlit status
    tick() {}

    reap() {
        const targetPos = this.position
        const plant = this.world.getTile(targetPos).plant
        this.world.dePopTile(targetPos, plant)
        if (plant) {
            this.world.gameState.removePlantFromState(this)
            plant.destroy()
        }
    }

    getNearbyTileForAction() {
        const nearbyTiles = []
        const playerPos = this.position

        console.log(`Player Position: (${playerPos.x}, ${playerPos.y})`)

        for (let dx = -this.scene.interactionRange; dx <= this.scene.interactionRange; dx++) {
            for (let dy = -this.scene.interactionRange; dy <= this.scene.interactionRange; dy++) {
                const targetPos = new Vector(playerPos.x + dx, playerPos.y + dy)
                const tile = this.world.getTile(targetPos)

                if (tile && tile.plant) {
                    // Only consider tiles with valid plants
                    nearbyTiles.push(tile)
                    console.log(`Found plant at (${targetPos.x}, ${targetPos.y})`)
                } else {
                    // console.log(`No plant at (${targetPos.x}, ${targetPos.y})`);
                }
            }
        }

        console.log(`Nearby tiles with plants: ${nearbyTiles.length}`)
        return nearbyTiles[0] || null // Return the first valid tile with a plant
    }
}

class StateMachine {
    
    constructor(parent){
        this.parent =  parent;
        this.states = {};
        this.currentState = null;
        this.stateNames = [];
    }
    addState(arg){
        this.stateNames.push(arg.name)
        this.states[arg.name] = arg;
    }
    changeState(key){
        const newState = this.states[key];
        console.log(newState)
        if (!(newState)){
            console.log("Invalid state!");
            return(false);
        } 
        if (newState === this.currentState){
            console.log("Already in state!");
            return(false);
        } 
        if ( this.states[this.currentState]){     // don't exit a state that doesn't exist!
            this.states[this.currentState].exit();
        }
        this.currentState = newState;
        this.currentState.enter();
    }
    update(time,delta){
        console.log(this.currentState)
        this.currentState && this.currentState.update(time,delta);
    }
}

/* Example of adding a state machine to an object and adding states
This is from another project

class Player extends Character {
    constructor(scene, gridX, gridY) {
        super(scene,gridX, gridY, 200,'playerOw');
        // When defining states, make a reference to the object it belongs to. 
        // using this in its declaration scope will refer to itself.
        const player = this;
        const states = [
            {
                name: "idle",
                enter(){
                    // Function to handle movement
                    const handleMovement = (direction) => {
                        player.walk.updateDir(direction);
                        if ( player.walk.moveForward()){

                            player.sm.changeState("walk");
                        }
                    };
                
                    // Listen for inputs and move the player
                    if (cursors.left.isDown) {
                        handleMovement(new Vector2(-1, 0));
                    } else if (cursors.down.isDown) {
                        handleMovement(new Vector2(0, 1));
                    } else if (cursors.up.isDown) {
                        handleMovement(new Vector2(0, -1));
                    } else if (cursors.right.isDown) {
                        handleMovement(new Vector2(1, 0));
                     } else if (Phaser.Input.Keyboard.JustDown(enterKey)) {
                        const playerPosition = player.gridObj.position;
                        const playerDirection = player.gridObj.direction;
                        const lookPosition = playerPosition.add(playerDirection);

                        player.world.interact(lookPosition);
                    } else{
                        player.play("idle")
                    }
                },
                exit(){},
                update(time, delta) {
                    // Function to handle movement
                    const handleMovement = (direction) => {
                        player.walk.updateDir(direction);
                        if ( player.walk.moveForward()){

                            player.sm.changeState("walk");
                        }
                    };
                
                    // Listen for inputs and move the player
                    if (cursors.left.isDown) {
                        handleMovement(new Vector2(-1, 0));
                    } else if (cursors.down.isDown) {
                        handleMovement(new Vector2(0, 1));
                    } else if (cursors.up.isDown) {
                        handleMovement(new Vector2(0, -1));
                    } else if (cursors.right.isDown) {
                        handleMovement(new Vector2(1, 0));
                     } else if (Phaser.Input.Keyboard.JustDown(enterKey)) {
                        const playerPosition = player.gridObj.position;
                        const playerDirection = player.gridObj.direction;
                        const lookPosition = playerPosition.add(playerDirection);

                        player.world.interact(lookPosition);
                    }
                }
            },
            {
                name: "walk",
                enter(){
                    if (player.gridObj.direction.x == 1 && player.anims.currentAnim?.key != 'walk-west'){
                        player.play('walk-west')
                    }
                    if (player.gridObj.direction.x == -1 && player.anims.currentAnim?.key !== 'walk-east'){
                        player.play('walk-east')
                    }
                    if (player.gridObj.direction.y == 1 && player.anims.currentAnim?.key !== 'walk-south'){
                        player.play('walk-south')
                    }
                    if (player.gridObj.direction.y == -1 && player.anims.currentAnim?.key !== 'walk-north'){
                        player.play('walk-north')
                    }
                },
                exit(){},
                update(time,delta){
                    
                    player.walk.update(time,delta);
                }
            },
            {
                name: "talk",
                enter(){},
                exit(){},
                update(time,delta){
                }
            }
        ]
        this.setUpSM(states);


        setUpSM(states){
            //adding states.
            for ( let i of states){
                this.sm.addState(i);
            }
            this.sm.changeState("idle");
        }
                   
        update(time, delta) {
            // Listen for movement inputs
            this.sm.update(time,delta);
        }
    }


*/
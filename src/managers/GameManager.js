class WorldStates  {
    constructor(gameManager){
        this.gameManager = gameManager
        this.formerStates = []
        this.undoneStates = []
        this.currentAction;
    }
    undo(){
        if ( this.formerStates.length < 1 ){
            console.log("cannot undo")
        } else {
            this.undoneStates.push(this.currentAction);
            this.currentAction = this.formerStates.pop();
            console.log(this.currentAction)
            this.gameManager.world.loadWorldInstance(this.currentAction)
        }
    }
    redo(){
        if (this.undoneStates.length < 1){
            console.log("cannot redo")
        } else {
            this.formerStates.push(this.currentAction)
            this.currentAction = this.undoneStates.pop();
            this.gameManager.world.loadWorldInstance(this.currentAction)
        }
    }
    addState(){
        this.formerStates.push(this.currentAction)
        this.currentAction = this.gameManager.world.exportWorldInstance()
        console.log(this)
        //this.gameManager.world.loadWorldInstance(this.currentAction)
        console.log(this)
    }

}

class GameManager {
    constructor(scene, gridSize, tileSize, saveData = defaultSaveData) {
        this.scene = scene
        this.tileSize = tileSize
        
        // Instantiate key modules
        this.world = new World(this, gridSize, tileSize)

        this.plantManager = new PlantManager(this.scene, this)
        this.winManager = new WinConManager()

        this.player = new Player(this, new Vector(0, 0))
        
        this.worldStates = new WorldStates(this);
        

        this.loadGame(saveData)
        this.world.loadWorldInstance(this.worldStates.currentAction)

        this.worldUpdated = new CustomEvent("world-updated", {});
        document.addEventListener("world-updated", () => {
            this.gameStateUpdated();
        })
    }

    exportGame(){
        const gameManager = this
        this.gameStateUpdated()
        return (JSON.stringify({
            currentAction: gameManager.worldStates.currentAction,
            formerStates: gameManager.worldStates.formerStates,
            undoneStates: gameManager.worldStates.undoneStates
        }))
    }

    loadGame(data){
        const sampleStates= JSON.parse(data)
        this.worldStates.currentAction = sampleStates.currentAction
        this.worldStates.formerStates = sampleStates.formerStates
        this.worldStates.undoneStates = sampleStates.undoneStates
    }

    gameStateUpdated(){
        //save the game state
        //add state to worldStates 
        const state = this.world.exportWorldInstance();
        this.worldStates.addState(state)
    }


    update(time, delta) {
        this.player.update(time, delta)
    }

    tick(hour = 1, day = 0) {
        // Update time
        this.time.hour += hour
        if (this.time.hour >= 24) {
            this.time.day += Math.floor(this.time.hour / 24)
            this.time.hour %= 24
        }
        this.time.day += day

        this.plantManager.tick()

        // Trigger world/weather updates and plant mechanics
        this.world.generateRandomWeather()

        // Check win condition
        if (this.winManager.checkWinCondition()) {
            console.log('🔥 YOU WIN! 🔥')
        }
    }

    setPlayer(player) {
        // Associate the player instance with GameManager
        this.player = player
    }
}

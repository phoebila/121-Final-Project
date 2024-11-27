class WorldStates  {
    constructor(gameManager){
        this.gameManager = gameManager
        this.formerStates = []
        this.undoneStates = []
    }
    undo(){
        // pop state from the formerStates array. load it. pushes it to the undoneStates array
        if ( this.formerStates.length < 2){
            return
        }
        const state = this.formerStates.pop();
        if (state ){
            this.gameManager.world.loadGame(this.formerStates[-1])
            this.undoneStates.push(state)
        }
    }
    redo(){
        // pop state from undoneStates. push it to formerStates load it
        const state = undoneStates.pop();
        if (state){
            this.gameManager.world.loadWorldInstance(state)
            this.formerStates.push(state)
        }

    }
    addState(state){
        // clear undone states
        // push arg to formerstates
        this.undoneStates = []
        this.formerStates.push(state)
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
        
        this.worldStates = new worldStates(this);
        

        this.loadGame(saveData)
        this.world.loadWorldInstance(this.worldStates[-1])
    }

    saveGame(){
        return (JSON.stringify(this.worldStates))
    }

    loadGame(data){
        const sampleStates= JSON.parse(data)
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

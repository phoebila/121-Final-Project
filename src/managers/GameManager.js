class GameManager {
    constructor(scene, gridSize, tileSize, saveData = defaultSaveData) {
        this.scene = scene
        this.tileSize = tileSize
        this.time = { hour: 0, day: 0 }
        // Instantiate key modules
        this.world = new World(this, gridSize, tileSize)

        this.plantManager = new PlantManager(this.scene, this)
        this.winManager = new WinConManager(this)

        this.player = new Player(this, new Vector(0, 0))
        this.worldTimeLine = new WorldTimeLine(this)

        this.loadGame(saveData)
        this.world.loadWorldInstance(this.worldTimeLine.currentAction)

        this.worldUpdated = new CustomEvent('world-updated', {})
        document.addEventListener('world-updated', () => {
            this.gameStateUpdated()
        })
    }

    exportGame() {
        const gameManager = this
        return JSON.stringify({
            currentAction: gameManager.worldTimeLine.currentAction,
            formerStates: gameManager.worldTimeLine.formerStates,
            undoneStates: gameManager.worldTimeLine.undoneStates,
        })
    }

    loadGame(data) {
        const sampleStates = JSON.parse(data)
        this.worldTimeLine.currentAction = sampleStates.currentAction
        this.worldTimeLine.formerStates = sampleStates.formerStates
        this.worldTimeLine.undoneStates = sampleStates.undoneStates
    }

    gameStateUpdated() {
        //save the game state
        //add state to worldStates
        const state = this.world.exportWorldInstance()
        this.worldTimeLine.addState(state)
    }

    update(time, delta) {
        this.player.update(time, delta)
    }

    tick(hour = 1, day = 0) {
        this.gameStateUpdated()
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
        this.winManager.tick();
    }

    setPlayer(player) {
        // Associate the player instance with GameManager
        this.player = player
    }
}

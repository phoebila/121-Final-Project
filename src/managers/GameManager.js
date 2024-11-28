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

        this.worldStates = new worldTimeLine(this)

        this.loadGame(saveData)
        this.world.loadWorldInstance(this.worldStates.currentAction)

        this.worldUpdated = new CustomEvent('world-updated', {})
        document.addEventListener('world-updated', () => {
            this.gameStateUpdated()
        })
    }

    exportGame() {
        const gameManager = this
        return JSON.stringify({
            currentAction: gameManager.worldStates.currentAction,
            formerStates: gameManager.worldStates.formerStates,
            undoneStates: gameManager.worldStates.undoneStates,
        })
    }

    loadGame(data) {
        const sampleStates = JSON.parse(data)
        this.worldStates.currentAction = sampleStates.currentAction
        this.worldStates.formerStates = sampleStates.formerStates
        this.worldStates.undoneStates = sampleStates.undoneStates
    }

    gameStateUpdated() {
        //save the game state
        //add state to worldStates
        const state = this.world.exportWorldInstance()
        this.worldStates.addState(state)
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
        if (this.winManager.checkWinCondition()) {
            console.log('🔥 YOU WIN! 🔥')
        }
    }

    setPlayer(player) {
        // Associate the player instance with GameManager
        this.player = player
    }
}

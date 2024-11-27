class GameManager {
    constructor(scene, gridSize, tileSize) {
        this.scene = scene
        this.tileSize = tileSize

        // Instantiate key modules
        this.world = new World(scene, gridSize, tileSize)
        this.plantManager = new PlantManager(this.scene, this)
        this.winManager = new WinConManager()

        this.time = { day: 0, hour: 0 }
        this.player = new Player(this, new Vector(0, 0))
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

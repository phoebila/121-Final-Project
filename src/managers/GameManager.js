class GameManager {
    constructor(scene,gridSize, tileSize) {
        this.scene = scene;
        this.tileSize = tileSize;  // Tile size in pixels

        // Instantiate key modules
        this.world = new World(scene, gridSize, tileSize); // Manages tiles and grid logic
        this.plantManager = new PlantManager(this.scene, this)
        this.winManager = new WinConManager();           // Tracks plants and win condition

        this.time = { day: 0, hour: 0 };          // Time-tracking functionality
        this.player = new Player(this, new Vector(0, 0)) // Create the player at grid position (0, 0)
    }



    update(time,delta){
        this.player.update(time,delta);
    }

    tick(hour = 1, day = 0) {

        // Update time
        this.time.hour += hour;
        if (this.time.hour >= 24) {
            this.time.day += Math.floor(this.time.hour / 24);
            this.time.hour %= 24;
        }

        this.plantManager.tick();


        // Trigger world/weather updates and plant mechanics
        this.world.generateRandomWeather();     // Change water and light levels for tiles

        // Check win condition
        if (this.winManager.checkWinCondition()) {
            console.log("🔥 YOU WIN! 🔥");
        }
    }

    setPlayer(player) {
        // Associate the player instance with GameManager
        this.player = player;
    }

    save(name) {
        // Serialize state for saving
        const saveData = {
            time: this.time,
            world: this.world.serialize(),      // (Uses World.serialize())
            gameState: this.winManager.serialize(), // (Uses GameState.serialize())
        };

        // Save to localStorage
        localStorage.setItem(name, JSON.stringify(saveData));
        console.log(`Saved game to slot '${name}':`, saveData);
    }

    load(name) {
        // Load game data from localStorage
        const saveData = JSON.parse(localStorage.getItem(name));
        if (!saveData) {
            console.error(`No saved game found under '${name}'`);
            return;
        }

        // Deserialize state
        this.time = saveData.time;
        this.world.deserialize(saveData.world);       // Deserialize world
        this.winManager.deserialize(saveData.gameState); // Deserialize game state
        console.log(`Loaded game '${name}':`, saveData);
    }
}
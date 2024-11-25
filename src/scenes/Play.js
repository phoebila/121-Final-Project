class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        this.BUTTON_LAYER = 100
        this.TILE_SIZE = 8
        this.interactionRange = 3 // Player must be within 3 tiles
    }

    create() {
        // Initialize the world and player
        console.log('%cPLAY SCENE :^)', testColor)

        this.tickButton = this.constructButton(
            this.TILE_SIZE,
            this.TILE_SIZE,
            10,
            6,
            'Press to tick time',
            () => this.moveTime(),
        )

        this.testSave = this.constructButton(
            this.TILE_SIZE,
            this.TILE_SIZE+ 10,
            10,
            6,
            'Press to test save',
            () => {
                for (let i =0; i < this.world.grid.length; i++){
                    for (let j = 0; j < this.world.grid[i].length; j++){
                        console.log(this.world.grid[i][j].saveMe());
                    }
                }
            },
        )

        // Add grid and player to the scene
        this.world = new World(this, 10, 10, 8) // Assuming you have a World class that handles the grid
        this.player = new Player(this, new Vector(0, 0), 'player') // Create the player at grid position (0, 0)
        this.cameras.main.centerOn(40, 40)
        this.cameras.main.setZoom(2)

        // Input handling

    }

    update(time, delta) {
        // Update the player and handle their movement
        this.player.update(time, delta)
    }

    constructButton(x, y, textSize, padding, text = 'default text', result) {
        const content = this.add.text(x + padding / 2, y + padding / 2, text, {
            fontSize: `${textSize - 2}px`,
            lineSpacing: 0,
        })
        content.height = textSize
        const UIBox = this.add.rectangle(
            x,
            y,
            Math.ceil((content.width + padding) / this.TILE_SIZE) * this.TILE_SIZE,
            content.height + padding,
            0xff0000,
        )

        content
            .setOrigin(0, 1.5)
            .setZ(this.BUTTON_LAYER + 100)
            .setDepth(this.BUTTON_LAYER + 1)
        UIBox.setOrigin(0, 1).setZ(this.BUTTON_LAYER).setDepth(this.BUTTON_LAYER)

        const button = { content, UIBox }
        UIBox.setInteractive().on('pointerdown', result)

        return button
    }

    moveTime(hour = 1, day = 0, world = this.world) {
        world.tick(hour, day)
        world.gameState.debugState()
    }
}

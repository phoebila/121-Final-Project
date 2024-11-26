class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init(data) {
        this.BUTTON_LAYER = 100
        this.TILE_SIZE = tileSize
        this.interactionRange = 3 // Player must be within 3 tiles

        this.SAVE_NAME = data.SAVE_NAME
        this.SAVE_FILE = data.SAVE_FILE
    }

    create() {
        // Initialize the world and player
        console.log('%cPLAY SCENE :^)', testColor)

        console.log(`SAVE NAME = ${this.SAVE_NAME}`)
        console.log(`SAVE FILE = ${this.SAVE_FILE}`)

        this.scene.get('uiScene').displayPlayUI()

        // Add grid and player to the scene
        this.world = new World(this, worldDimensions.height, worldDimensions.width, 8) // Assuming you have a World class that handles the grid
        this.player = new Player(this, new Vector(0, 0), 'player') // Create the player at grid position (0, 0)
        this.cameras.main.centerOn(
            centerX - this.TILE_SIZE,
            centerY - this.TILE_SIZE * worldPadding - this.TILE_SIZE * 2,
        )

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
            .setOrigin(0)
            .setZ(this.BUTTON_LAYER + 1)
            .setDepth(this.BUTTON_LAYER + 1)
        UIBox.setOrigin(0).setZ(this.BUTTON_LAYER).setDepth(this.BUTTON_LAYER)

        const button = { content, UIBox }
        UIBox.setInteractive().on('pointerdown', result)

        return button
    }

    moveTime(hour = 1, day = 0, world = this.world) {
        world.tick(hour, day)
        world.gameState.debugState()
    }

    savePrompt() {
        // eventually, allow for save as link
        // for now, just save

        let saveNames = localStorage.getItem('saveNames').split(' ').map(Number)
        let saveFiles = localStorage.getItem('saveFiles').split(' ').map(Number)
        if (saveNames.find(element => element == this.SAVE_NAME)) {
            const key = saveNames.find(element => element == this.SAVE_NAME)
            const index = saveNames.indexOf(key)

            console.log(localStorage.getItem('saveFiles'))

            if (index > -1) {
                const newData = Math.floor(Math.floor(Math.random() * 90000) + 10000)
                saveFiles[index] = newData

                localStorage.setItem('saveFiles', saveFiles.join(' '))
            }

            console.log(localStorage.getItem('saveFiles'))
        } else {
            console.log('there is no save file under that name')
            console.log(saveNames)
        }
    }

    saveToFile() {
        // currently unused, to be used with load from file
        const data = 'text'
        const filename = 'myfilename.txt'
        const type = 'text/plain'

        // src = https://stackoverflow.com/questions/13405129/create-and-save-a-file-with-javascript
        var file = new Blob([data], { type: type })
        if (window.navigator.msSaveOrOpenBlob) window.navigator.msSaveOrOpenBlob(file, filename)
        else {
            var a = document.createElement('a'),
                url = URL.createObjectURL(file)
            a.href = url
            a.download = filename
            document.body.appendChild(a)
            a.click()
            setTimeout(function () {
                document.body.removeChild(a)
                window.URL.revokeObjectURL(url)
            }, 0)
        }
    }
}

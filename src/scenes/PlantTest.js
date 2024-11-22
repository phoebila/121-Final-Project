class PlantTest extends Phaser.Scene {
    constructor() {
        super('plantTestScene')
    }

    init() {
        this.BUTTON_LAYER = 100
        this.TILE_SIZE = 8
    }

    create() {
        // running checks
        console.log('%cPLANT TEST SCENE :^)', testColor)
        // add grid
        // add player to grid
        this.world = new World(this, 5, 5, 8)
        this.player = new Player(this, new Vector(0, 0), 'player')
        this.obj = new Plant(this, new Vector(1, 1), this.world, 'flower', null, 1, 1, 8)
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setZoom(2)

        this.tickButton = this.constructButton(-40, -40, 16, 2, 'tick', this.moveTime)

        this.obj.anims.play('flower')
        console.log(this.obj)

        this.input.on('pointerdown', () => {
            console.log('weathergen')
            this.world.generateWeather(1, 3)
            this.obj.logCheckCanGrow()
        })
    }

    update(time, delta) {
        this.player.update(time, delta)
        this.obj.update()
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
            .setZ(this.BUTTON_LAYER + 100)
            .setDepth(this.BUTTON_LAYER + 1)
        UIBox.setOrigin(0).setZ(this.BUTTON_LAYER).setDepth(this.BUTTON_LAYER)

        const button = { content, UIBox }
        UIBox.setInteractive().on('pointerdown', result)

        return button
    }

    moveTime() {
        console.log('peepee')
    }
}

// check that condition is correct, stop program if it isn't
// ex: let test = 0; assert(test == 1); throw error
function assert(condition, message) {
    // src = https://stackoverflow.com/questions/15313418/what-is-assert-in-javascript
    if (!condition) {
        throw new Error(message ?? `Assertion failed: condition is ${condition}`)
    }
}

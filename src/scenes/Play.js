class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        this.BUTTON_LAYER = 100
    }

    create() {
        // running checks
        console.log('%cPLAY SCENE :^)', testColor)

        this.tickButton = this.constructButton(8, 8, 10, 6)
        this.add.rectangle(0, 0, 8, 8, 0x00ff00).setOrigin(0)
        this.add.rectangle(0, 8, 8, 8, 0x0000ff).setOrigin(0)
        this.add.rectangle(0, 16, 8, 8, 0x00ff00).setOrigin(0)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
            console.log('This is how keys work!')
        }
    }

    constructButton(x, y, textSize, padding, text = 'default text') {
        const content = this.add.text(x + padding/2, y + padding/2, text, { fontSize: `${textSize}px`, lineSpacing: 0 })
        content.height = textSize
        const button = this.add.rectangle(x, y, content.width + padding, content.height + padding, 0xff0000)

        content.setOrigin(0).setZ(this.BUTTON_LAYER + 100).setDepth(this.BUTTON_LAYER + 1)
        button.setOrigin(0).setZ(this.BUTTON_LAYER).setDepth(this.BUTTON_LAYER)

        return button
    }
}

// check that condition is correct, stop program if it isn't 
// ex: let test = 0; assert(test == 1); throw error
function assert(condition, message) {
    // src = https://stackoverflow.com/questions/15313418/what-is-assert-in-javascript
    if (!condition) {
        throw new Error(message ?? `Assertion failed: condition is ${condition}`);
    }
}
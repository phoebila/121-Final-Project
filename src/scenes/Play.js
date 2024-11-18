class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        // running checks
        console.log('%cPLAY SCENE :^)', testColor)

        this.tickButton = this.constructButton(centerX, centerY, 100, 15)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
            console.log('This is how keys work!')
        }
    }

    constructButton(x, y, width, padding, text = 'default text') {
        const button = this.add.rectangle(x, y, width, 100, 0xff0000)

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
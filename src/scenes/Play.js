class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    create() {
        // running checks
        console.log('%cPLAY SCENE :^)', testColor)
    }

    update() {
        if (Phaser.Input.Keyboard.JustDown(cursors.down)) {
            console.log('This is how keys work!')
        }
    }
}
class Keys extends Phaser.Scene {
    constructor() {
        super({ key: 'keysScene', active: true })
    }

    create() {
        // running checks
        console.log('%cKEYS SCENE :^)', testColor)
        window.localStorage
            ? console.log('%cLocal storage supported by this cat! (^･･^=)~', goodColor)
            : console.log('%cLocal storage not supported by this cat ~(=^･･^)', badColor)

        cursors = this.input.keyboard.createCursorKeys()
        space = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
        eKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.E)
        gKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.G)
    }
}

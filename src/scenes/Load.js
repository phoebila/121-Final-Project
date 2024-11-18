class Load extends Phaser.Scene {
    constructor() {
        super('LoadScene')
    }

    preload() {
        // loading bar
        this.load.spritesheet('player', './assets/spritesheets/temp-spritesheet.png', { frameWidth: 8, frameHeight: 8, startFrame: 0 })
        this.load.spritesheet('flower', './assets/spritesheets/temp-spritesheet.png', { frameWidth: 8, frameHeight: 8, startFrame: 1, endFrame: 3 })
    }

    create() {
        // running checks
        console.log('%cLOAD SCENE :^)', testColor)
        // moving through
        this.scene.start('playScene')

        this.anims.create({
            key: 'flower',
            frames: this.anims.generateFrameNames('flower', { start: 0, end: 2 }),
            frameRate: 5,
            yoyo: true,
            repeat: -1
        })
    }
}
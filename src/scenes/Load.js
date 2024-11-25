class Load extends Phaser.Scene {
    constructor() {
        super('loadScene')
    }

    preload() {
        // loading bar
        this.load.spritesheet('grass-spritesheet', './assets/spritesheets/grass-spritesheet.png', {
            frameWidth: 8,
            frameHeight: 8,
            startFrame: 0,
        })
        this.load.spritesheet('player', './assets/spritesheets/temp-spritesheet.png', {
            frameWidth: 8,
            frameHeight: 8,
            startFrame: 0,
        })
        this.load.spritesheet('flower', './assets/spritesheets/temp-spritesheet.png', {
            frameWidth: 8,
            frameHeight: 8,
            startFrame: 1,
            endFrame: 3,
        })
        this.load.image('tree', './assets/sprites/placeHolderPlant1.png')
        this.load.image('bush', './assets/sprites/placeHolderPlant2.png')
    }

    create() {
        // running checks
        console.log('%cLOAD SCENE :^)', testColor)
        // moving through
        this.scene.start('menuScene')
    }

    initializeData() {
        const data = [
            { id: 'saveNames', auto: 'null' },
            { id: 'saveFiles', auto: 'null' },
        ]

        data.forEach(element => {
            this.retrieveData(element.id, element.auto)
        })
    }

    retrieveData(id, auto) {
        if (!localStorage.getItem(id)) {
            localStorage.setItem(id, auto)
            console.log(`(brand new data) ${id}: ${localStorage.getItem(id)}`)
        } else {
            console.log(`${id}: ${localStorage.getItem(id)}`)
        }
    }
}

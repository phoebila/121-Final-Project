class UI extends Phaser.Scene {
    constructor() {
        super({ key: 'uiScene', active: true })
    }

    create() {
        // running checks
        console.log('%cUI SCENE :^)', testColor)

        if (this.scene.get('playScene').active) {
        }
    }

    displayPlayUI() {
        this.tickButton = this.constructButton(tileSize, tileSize, 10, 6, 'tick time', () =>
            this.tick(),
        )

        this.saveButton = this.constructButton(9 * tileSize, tileSize, 10, 6, 'save', () =>
            this.save(),
        )
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
            Math.ceil((content.width + padding) / tileSize) * tileSize,
            content.height + padding,
            0xff0000,
        )

        content.setOrigin(0).setZ(1).setDepth(1)
        UIBox.setOrigin(0)

        const button = { content, UIBox }
        UIBox.setInteractive().on('pointerdown', result)

        return button
    }

    tick() {
        this.scene.get('playScene').gameManager.tick()
    }

    save() {
        this.scene.get('playScene').save()
    }
}

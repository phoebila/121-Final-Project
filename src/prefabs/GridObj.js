class GridObj extends Phaser.GameObjects.Sprite {
    constructor(gameManager, position, texture) {
        const trueX = position.x * gameManager.tileSize
        const trueY = position.y * gameManager.tileSize
        super(gameManager.scene, trueX, trueY, texture)

        this.gameManager = gameManager
        this.world = gameManager.world
        this.scene = gameManager.scene
        this.position = position.copy()
        this.scene.add.existing(this)
        this.setOrigin(0)
    }

    teleport(target) {
        if (!this.world.checkEnterable(target)) {
            return false
        }
        this.position = target
        this.x = this.position.x * this.world.tileSize
        this.y = this.position.y * this.world.tileSize
        return true
    }
}
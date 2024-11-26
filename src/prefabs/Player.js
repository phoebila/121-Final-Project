class Player extends GridObj {
    constructor(scene, position, sprite) {
        super(scene, position, scene.world, sprite)
        this.waitTime = 200
        this.timer = 0
        this.direction = new Vector(0, 0)
        this.moveComp = new MoveComp(this)

        this.setOrigin(0)

        this.states = initializePlayerState(this)
        this.setUpSM()
        this.sm.changeState('idle')
    }

    playAnimation(animation, callback) {
        this.play(animation)
        this.once(
            'animationcomplete',
            () => {
                callback && callback()
            },
            this.scene,
        )
    }

    update(time, delta) {
        this.sm.update(time, delta)
    }

    setUpSM() {
        this.sm = new StateMachine(this)
        for (let i of this.states) {
            this.sm.addState(i)
        }
    }

    move() {
        super.move(this.direction)
    }

    sowPlant() {
        const playerPos = this.position
        // If tile is free or contains the player, sow the plant
        if (this.world.checkPlantable(playerPos)) {
            // Create and place the plant without removing the player
            const plant = new Plant(this.scene, playerPos, this.world)
        }
    }

    reap() {
        const targetPos = this.position
        const plant = this.world.getTile(targetPos).plant
        this.world.dePopTile(targetPos, plant)
        if (plant) {
            this.world.gameState.removePlantFromState(this)
            plant.destroy()
        }
    }

    getNearbyTileForAction() {
        const nearbyTiles = []
        const playerPos = this.position

        for (let dx = -this.scene.interactionRange; dx <= this.scene.interactionRange; dx++) {
            for (let dy = -this.scene.interactionRange; dy <= this.scene.interactionRange; dy++) {
                const targetPos = new Vector(playerPos.x + dx, playerPos.y + dy)
                const tile = this.world.getTile(targetPos)

                if (tile && tile.plant) {
                    // Only consider tiles with valid plants
                    nearbyTiles.push(tile)
                }
            }
        }

        // Return the first valid tile with a plant
        return nearbyTiles[0] || null
    }
}

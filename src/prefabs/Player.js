class Player extends GridObj {
    constructor(gameManager, position) {
        super(gameManager, position, 'player')
        this.direction = new Vector(0, 0)

        this.speed = 0.4
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
}

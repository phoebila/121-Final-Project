function initializePlayerState(player) {
    return [
        {
            name: 'idle',
            enter() {
                //play idle anim
                player.play('player-idle')
            },
            exit() {},
            update() {
                const readInput = direction => {
                    player.direction = direction
                    player.sm.changeState('walk')
                }
                if (cursors.left.isDown) {
                    readInput(new Vector(-1, 0))
                } else if (cursors.down.isDown) {
                    readInput(new Vector(0, 1))
                } else if (cursors.up.isDown) {
                    readInput(new Vector(0, -1))
                } else if (cursors.right.isDown) {
                    readInput(new Vector(1, 0))
                } else if (space.isDown) {
                    player.sm.changeState('reap')
                } else if (eKey.isDown) {
                    player.sm.changeState('sow')
                } else if (Phaser.Input.Keyboard.JustDown(gKey)) {
                    player.sm.changeState('dance')
                }
            },
        },
        {
            name: 'walk',
            enter() {
                player.play('player-walk')
                player.moveComp.startMoving(() => {
                    document.dispatchEvent(player.gameManager.worldUpdated)
                    player.sm.changeState('idle')
                })
            },
            exit() {},
            update(time, delta) {
                player.moveComp.update(time, delta)
            },
        },
        {
            name: 'reap',
            enter() {
                // play animation then do function on callback
                player.playAnimation('player-reap', () => {
                    if (player.gameManager.plantManager.removePlant(player.position)) {
                        document.dispatchEvent(player.gameManager.worldUpdated)
                    }
                    player.sm.changeState('idle')
                })
            },
            exit() {},
            update() {},
        },
        {
            name: 'sow',
            enter() {
                // play animation then do function on callback
                player.playAnimation('player-sow', () => {
                    if (player.gameManager.plantManager.addPlant(player.position)) {
                        document.dispatchEvent(player.gameManager.worldUpdated)
                    }
                    player.sm.changeState('idle')
                })
            },
            exit() {},
            update() {},
        },
        {
            name: 'dance',
            enter() {
                // play animation then do function on callback
                player.playAnimation('player-dance', () => {})
            },
            exit() {},
            update() {
                if (!gKey.isDown) {
                    player.sm.changeState('idle')
                }
            },
        },
    ]
}

// Base class for player components
class Componenet {
    constructor(parent) {
        this.parent = parent
    }
}

// Handles player movement
class MoveComp extends Componenet {
    constructor(parent) {
        super(parent)
        this.targetGridPosition = new Vector(0, 0)
        this.startGridPosition = new Vector(0, 0)
        this.trueTargetPosition = new Vector(0, 0)
        this.callback = null
        this.gameManager = parent.gameManager
        this.world = this.gameManager.world
        this.walking = false
    }

    startMoving(callback) {
        this.callback = callback
        this.speedVector = this.parent.direction.mult(this.parent.speed)
        this.startGridPosition = this.parent.position.copy()
        this.targetGridPosition = this.parent.position.add(this.parent.direction)
        this.trueTargetPosition.x = this.targetGridPosition.x * this.gameManager.tileSize
        this.trueTargetPosition.y = this.targetGridPosition.y * this.gameManager.tileSize

        if (!this.world.checkEnterable(this.targetGridPosition)) {
            this.parent.sm.changeState('idle')
            return
        }
    }

    update(time, delta) {
        this.moveRoutine(time, delta)
    }

    moveRoutine(time, delta) {
        for (let axis of ['x', 'y']) {
            this.parent[axis] += (this.speedVector[axis] * delta) / 5
            if (
                (this.parent[axis] > this.trueTargetPosition[axis] &&
                    this.parent.direction[axis] > 0) ||
                (this.parent[axis] < this.trueTargetPosition[axis] &&
                    this.parent.direction[axis] < 0)
            ) {
                this.parent.x = this.trueTargetPosition.x
                this.parent.y = this.trueTargetPosition.y
                this.parent.position = this.targetGridPosition.copy()
                this.callback && this.callback()
                this.walking = false
                return
            }
        }
    }
}

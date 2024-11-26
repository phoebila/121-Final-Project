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
            name: 'coolDown',
            enter() {
                // play cool down anim?
                // wait a few frames then change state back to idle
                player.sm.changeState('idle')
            },
            exit() {},
            update() {},
        },
        {
            name: 'walk',
            enter() {
                player.play('player-walk')
                player.moveComp.startMoving(() => {
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
                    player.reap()
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
                    player.sowPlant()
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
        this.world = this.parent.world
        this.walking = false
    }

    startMoving(callback) {
        this.callback = callback
        this.speedVector = this.parent.direction.mult(2)
        this.startGridPosition = this.parent.position.copy()
        this.targetGridPosition = this.parent.position.add(this.parent.direction)
        this.trueTargetPosition.x = this.targetGridPosition.x * this.world.tileSize
        this.trueTargetPosition.y = this.targetGridPosition.y * this.world.tileSize

        if (!this.world.checkEnterable(this.targetGridPosition, this.parent)) {
            this.parent.sm.changeState('idle')
            return
        }
        this.world.popTile(this.targetGridPosition, this.parent)
    }

    update(time, delta) {
        this.moveRoutine()
    }

    moveRoutine() {
        for (let axis of ['x', 'y']) {
            this.parent[axis] += this.speedVector[axis]
            if (
                (this.parent[axis] > this.trueTargetPosition[axis] &&
                    this.parent.direction[axis] > 0) ||
                (this.parent[axis] < this.trueTargetPosition[axis] &&
                    this.parent.direction[axis] < 0)
            ) {
                this.parent.x = this.trueTargetPosition.x
                this.parent.y = this.trueTargetPosition.y
                this.world.dePopTile(this.startGridPosition, this.parent)
                this.parent.position = this.targetGridPosition.copy()
                this.callback && this.callback()
                this.walking = false
                return
            }
        }
    }
}

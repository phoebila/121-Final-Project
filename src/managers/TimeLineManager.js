class worldTimeLine {
    constructor(gameManager) {
        this.gameManager = gameManager
        this.formerStates = []
        this.undoneStates = []
        this.currentAction
    }
    undo() {
        if (this.formerStates.length < 1) {
            console.log('cannot undo')
        } else {
            this.undoneStates.push(this.currentAction)
            this.currentAction = this.formerStates.pop()
            this.gameManager.world.loadWorldInstance(this.currentAction)
        }
    }
    redo() {
        if (this.undoneStates.length < 1) {
            console.log('cannot redo')
        } else {
            this.formerStates.push(this.currentAction)
            this.currentAction = this.undoneStates.pop()
            this.gameManager.world.loadWorldInstance(this.currentAction)
        }
    }
    addState() {
        this.undoneStates = []
        this.formerStates.push(this.currentAction)
        this.currentAction = this.gameManager.world.exportWorldInstance()
        this.gameManager.world.loadWorldInstance(this.currentAction)
    }

    exportState(){
        const gameManager = this
        return JSON.stringify({
            currentAction: this.currentAction,
            formerStates: this.formerStates,
            undoneStates: this.undoneStates,
        })
    }

    loadGame(data) {

        console.log(data)
        const sampleStates = JSON.parse(data)
        this.currentAction = sampleStates.currentAction
        this.formerStates = sampleStates.formerStates
        this.undoneStates = sampleStates.undoneStates
    }
}


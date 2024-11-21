class Play extends Phaser.Scene {
    constructor() {
        super('playScene')
    }

    init() {
        this.BUTTON_LAYER = 100
        this.TILE_SIZE = 8
    }

    create() {
        // running checks
        console.log('%cPLAY SCENE :^)', testColor)

        this.tickButton = this.constructButton(this.TILE_SIZE, this.TILE_SIZE, 10, 6, 'press to tick time', this.moveTime)


        // add grid
        // add player to grid
        this.world = new World(this,100,100,8);
        this.player = new Player(this, new Vector(0,0), 'player');
        this.obj = new GridObj(this, new Vector(0,0),this.world, "flower")
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setZoom(4);

        this.obj.anims.play('flower')

        // JDS
        this.gameState = new GameState();
        this.plant = new Plant(this,new Vector(3,0),this.world, 'flower', "blah", 3)
        this.plant2 = new Plant(this,new Vector(0,1),this.world, 'flower', "blah", 3)
        this.plant3 = new Plant(this,new Vector(0,2),this.world, 'flower', "blah", 3)
        this.gameState.addPlantToState(this.plant)
        this.gameState.addPlantToState(this.plant2)
        this.gameState.addPlantToState(this.plant3)
        this.gameState.debugState()
        console.log(this.gameState.checkWinCondition())
    }

    update(time,delta) {
        this.player.update(time,delta);
    }

    constructButton(x, y, textSize, padding, text = 'default text', result) {
        const content = this.add.text(x + padding/2, y + padding/2, text, { fontSize: `${textSize - 2}px`, lineSpacing: 0 })
        content.height = textSize
        const UIBox = this.add.rectangle(x, y, Math.ceil((content.width + padding) / this.TILE_SIZE) * this.TILE_SIZE, content.height + padding, 0xff0000)

        content.setOrigin(0).setZ(this.BUTTON_LAYER + 100).setDepth(this.BUTTON_LAYER + 1)
        UIBox.setOrigin(0).setZ(this.BUTTON_LAYER).setDepth(this.BUTTON_LAYER)

        const button = { content, UIBox }
        UIBox.setInteractive().on('pointerdown', result);

        return button
    }

    moveTime() {
        console.log('peepee')
    }
}

// check that condition is correct, stop program if it isn't 
// ex: let test = 0; assert(test == 1); throw error
function assert(condition, message) {
    // src = https://stackoverflow.com/questions/15313418/what-is-assert-in-javascript
    if (!condition) {
        throw new Error(message ?? `Assertion failed: condition is ${condition}`);
    }
}
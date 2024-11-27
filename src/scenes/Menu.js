class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene')
    }

    init() {
        this.SPLIT = '/'
    }

    create() {
        // running checks
        console.log('%cMENU SCENE :^)', testColor)

        this.saveName = -1

        const menuButtons = [
            { text: 'start', function: this.startScene.bind(this) },
            { text: 'new save', function: this.newSave.bind(this) },
            { text: 'load save', function: this.loadSave.bind(this) },
            { text: 'clear', function: this.clearSave.bind(this) },
            { text: 'clear all', function: this.clearAll.bind(this) },
        ]

        let posY = -tileSize * 2
        menuButtons.forEach(element => {
            if (element.text == 'new save') {
                this.constructButton(tileSize * 6, posY, 10, 6, element.text, element.function)
            } else if (element.text == 'clear') {
                this.constructButton(tileSize * 9, posY, 10, 6, element.text, element.function)
            } else {
                posY += tileSize * 3
                this.constructButton(tileSize, posY, 10, 6, element.text, element.function)
            }
        })

        this.scene.get('loadScene').initializeData()
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

        content.setOrigin(0).setZ(100).setDepth(1)
        UIBox.setOrigin(0)

        const button = { content, UIBox }
        UIBox.setInteractive().on('pointerdown', result)

        return button
    }

    startScene() {
        if (this.saveName == -1) {
            console.log('select save name')
        } else {
            this.scene.start('playScene', {
                SAVE_NAME: this.saveName,
                SAVE_FILE: this.saveFile,
            })
        }
    }

    newSave() {
        if (localStorage.getItem('saveNames') == 'null') {
            localStorage.setItem('saveNames', '1')

            const saveNames = localStorage.getItem('saveNames').split(this.SPLIT)

            console.log(`your new save data is under ${localStorage.getItem('saveNames')}`)

            const newData = JSON.stringify(defaultSaveData)
            localStorage.setItem('saveFiles', `${newData}`)

            console.log(JSON.parse(newData))

            console.log(`the assciociated game data is ${localStorage.getItem('saveFiles')}`)
        } else {
            let saveNames = localStorage.getItem('saveNames').split(this.SPLIT).map(Number)
            const newSaveNumber = saveNames.length > 0 ? saveNames[saveNames.length - 1] + 1 : 1
            saveNames.push(newSaveNumber)

            localStorage.setItem('saveNames', saveNames.join(this.SPLIT))

            console.log(`your new save data is under ${saveNames[saveNames.length - 1]}`)

            let saveFiles = localStorage.getItem('saveFiles').split(this.SPLIT)

            const newData = JSON.stringify(defaultSaveData)
            saveFiles.push(newData)

            localStorage.setItem('saveFiles', saveFiles.join(this.SPLIT))

            console.log(`the assciociated game data is ${saveFiles[saveFiles.length - 1]}`)
        }
    }

    loadSave() {
        if (localStorage.getItem('saveNames') == 'null') {
            console.log('no saves to load')
            return
        }

        const saveName = prompt('enter your save name')

        let saveNames = localStorage.getItem('saveNames').split(this.SPLIT).map(Number)
        let saveFiles = localStorage.getItem('saveFiles').split(this.SPLIT)
        if (saveNames.find(element => element == saveName)) {
            const key = saveNames.find(element => element == saveName)
            const index = saveNames.indexOf(key)

            if (index > -1) {
                this.saveName = saveNames[index]
                this.saveFile = saveFiles[index]
            }
        } else {
            console.log('there is no save file under that name')
            console.log(saveNames)
        }
    }

    clearSave() {
        if (localStorage.getItem('saveNames') == 'null') {
            console.log('no saves to clear')
            return
        }

        const saveName = prompt('enter your save name')

        let saveNames = localStorage.getItem('saveNames').split(this.SPLIT).map(Number)
        let saveFiles = localStorage.getItem('saveFiles').split(this.SPLIT)
        if (saveNames.find(element => element == saveName)) {
            const key = saveNames.find(element => element == saveName)
            const index = saveNames.indexOf(key)

            if (index > -1) {
                saveNames.splice(index, 1)
                saveFiles.splice(index, 1)
            }

            localStorage.setItem('saveNames', saveNames.join(this.SPLIT))
            localStorage.setItem('saveFiles', saveFiles.join(this.SPLIT))

            console.log(saveNames, saveFiles)
        } else {
            console.log('there is no save file under that name')
        }
    }

    clearAll() {
        if (confirm('are you sure?')) {
            localStorage.clear()
            this.scene.get('loadScene').initializeData()
        }
    }
}

// check that condition is correct, stop program if it isn't
// ex: let test = 0; assert(test == 1); throw error
function assert(condition, message) {
    // src = https://stackoverflow.com/questions/15313418/what-is-assert-in-javascript
    if (!condition) {
        throw new Error(message ?? `Assertion failed: condition is ${condition}`)
    }
}

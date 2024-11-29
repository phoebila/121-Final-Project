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

        const saveSlotCount = 3;

        const LoadFileHeight = 2 * tileSize;
        const deleteFileHeight = 4 * tileSize;
        for (let i = 1; i <= saveSlotCount; i++){
            const x = i * (tileSize * 10) - tileSize * 9;
            this.constructButton( x, LoadFileHeight, 10, 6, "Load Slot " + (i).toString(), ()=>{
                this.loadSave(i)
            })
            this.constructButton( x, deleteFileHeight, 10 ,6, " Delete Slot " + (i).toString(), () => {
                this.deleteSave(i)
            })
        }


        this.scene.get('loadScene').initializeData()
    }

    deleteSave(fileNum){
        const fileName = "Slot:" + fileNum.toString()
        localStorage.removeItem(fileName);
    }

    loadSave(fileNum){
        const fileName = "Slot:" + fileNum.toString()
        let file = localStorage.getItem(fileName)
        console.log(defaultSaveData);
        console.log(file)
        if ( !file ) {
            console.log(JSON.stringify(defaultSaveData))
            localStorage.setItem(fileName, JSON.stringify(defaultSaveData))
        }
        this.scene.start('playScene', {
            SAVE_NAME: fileName
        })
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

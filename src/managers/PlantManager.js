class PlantManager {
    constructor(scene, gameManager) {
        this.scene = scene
        this.gameManager = gameManager
        this.world = this.gameManager.world
        this.plantCollection = new Map()
        this.plantTypes = {
            EMPTY: 0,
            TREE: 1,
            Flower: 2,
            BUSH: 3,
        }
        this.configurePlantDB()
    }

    tick() {
        this.plantCollection.forEach(value => {
            value.tick()
        })
    }

    generatePlantKey(pos) {
        return pos.x.toString + ':' + pos.y.toString()
    }

    addPlant(pos, plantType) {
        if (!this.world.checkPlantable(pos)) return false
        const newPlant = new Plant(this.gameManager, pos, Math.floor(Math.random() * 3) + 1)
        this.world.addPlant(pos, newPlant)
        this.plantCollection.set(this.generatePlantKey(pos), newPlant)
    }

    removePlant(pos) {
        this.world.removePlant(pos)
        this.plantCollection.delete(this.generatePlantKey(pos))
    }

    configurePlantDB() {
        this.plantAttributes = [
            {
                name: 'empty',
            },
            {
                name: 'lily',
                sprite: 'lily',
                waterReq: 1,
                sunReq: 1,
                neighborReq: 8,
            },
            {
                name: 'sunflower',
                sprite: 'sunflower',
                waterReq: 1,
                sunReq: 1,
                neighborReq: 8,
            },
            {
                name: 'daisy',
                sprite: 'daisy',
                waterReq: 1,
                sunReq: 1,
                neighborReq: 8,
            },
        ]
    }
}

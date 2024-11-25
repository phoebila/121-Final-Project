const plantSpecies = ['empty', 'tree', 'flower', 'bush']

class Plant extends GridObj {
    constructor(
        scene,
        position,
        world,
        _texture,
        _species = null,
        water_req = 1,
        sun_req = 1,
        neighbor_req = 8,
    ) {
        const spec = Math.floor(Math.random() * 3) + 1
        const specName = plantSpecies[spec]

        super(scene, position, world, specName)
        this.species = spec
        this.growthLevel = 0

        this.WATER_RULE = water_req
        this.SUN_RULE = sun_req
        this.NEIGHBOR_RULE = neighbor_req
        this.world.gameState.addPlantToState(this)
    }

    grow() {
        if (this.checkCanGrow()) {
            this.growthLevel++
            this.setTint(this.tint + 0xffb3b3)
            const tile = this.world.getTile(this.position)
            tile.waterLvl = tile.waterLvl - this.WATER_RULE
            this.world.gameState.addPlantToState(this)
        }
    }

    tick() {
        this.grow()
    }

    checkCanGrow() {
        const tile = this.world.getTile(this.position)
        const waterReq = tile.waterLvl >= this.WATER_RULE
        const sunReq = tile.sunLvl >= this.SUN_RULE
        const adjReq = this.checkPlantNeighbors() < this.NEIGHBOR_RULE
        return (
            waterReq && //check water
            sunReq && //check sun
            adjReq &&
            this.growthLevel < GameState.WINNING_GROWTH_LEVEL
        )
    }

    logCheckCanGrow() {
        const tile = this.world.getTile(this.position)

        console.log(
            'Plant Rules: ' + this.WATER_RULE + ' ' + this.SUN_RULE + ' ' + this.NEIGHBOR_RULE,
        )
        console.log('Tile Water: ' + tile.waterLvl)
        console.log('Tile Sun: ' + tile.sunLvl)
        console.log('Plant Neighbors: ' + this.checkPlantNeighbors())
    }

    checkPlantNeighbors() {
        let plantCount = 0
        for (let dX = -1; dX < 1; dX++) {
            for (let dY = -1; dY < 1; dY++) {
                if (dX == 0 && dY == 0) {
                    continue
                }
                let posi = new Vector(this.position.x + dX, this.position.y + dY)
                let tile = this.world.getTile(posi)
                if (tile != null && tile.plant instanceof Plant) {
                    plantCount++
                }
            }
        }
        return plantCount
    }
}

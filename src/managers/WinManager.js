// When a plant is created, reaped, or had its growth level increased, it needs to be represented in this.totalPlants
class WinConManager {
    // If three or more plants are level three growth or above, the game is won.
    static WINNING_PLANT_COUNT = 3
    static WINNING_GROWTH_LEVEL = 3

    constructor() {
        this.totalPlants = new Map()
    }

    // Used to add new plants to the state of the game, and update an existing plant's growth level.
    addPlantToState(plant) {
        this.totalPlants.set(plant.position.stringify(), plant)
    }

    // Used when a plant is reaped.
    removePlantFromState(plant) {
        assert(this.totalPlants.get(plant.position.stringify()), 'Plant not found in Game State')

        this.totalPlants.delete(plant.position.stringify())
    }

    // Return plants from position.
    getPlantAtPosition(position) {
        if (this.totalPlants.get(position)) {
            return this.totalPlants.get(position)
        }
    }

    // Returns true or false based on whether the game has been completed or not.
    checkWinCondition() {
        const ripePlants = Array.from(this.totalPlants.values()).filter(
            plant => plant.growthLevel >= WinConManager.WINNING_GROWTH_LEVEL,
        )
        return ripePlants.length >= WinConManager.WINNING_PLANT_COUNT
    }
}

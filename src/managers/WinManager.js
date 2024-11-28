// When a plant is created, reaped, or had its growth level increased, it needs to be represented in this.totalPlants
class WinConManager {
    // If three or more plants are level three growth or above, the game is won.
    static WINNING_PLANT_COUNT = 3
    static WINNING_GROWTH_LEVEL = 3

    constructor(gameManager) {
        this.gameManager = gameManager
    }

    tick(){
        if (this.checkWinCondition()){
            console.log('🔥 YOU WIN! 🔥')
        }
    }

    // Returns true or false based on whether the game has been completed or not.
    checkWinCondition() {
        const ripePlants = Array.from(
            this.gameManager.plantManager.plantCollection.values(),
        ).filter(plant => plant.growthLevel >= WinConManager.WINNING_GROWTH_LEVEL)
        return ripePlants.length >= WinConManager.WINNING_PLANT_COUNT
    }
}

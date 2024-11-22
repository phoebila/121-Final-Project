// When a plant is created, reaped, or had its growth level increased, it needs to be represented in this.totalPlants
class GameState{
    // If three or more plants are level three growth or above, the game is won.
    static WINNING_PLANT_COUNT = 3
    static WINNING_GROWTH_LEVEL = 3
    constructor(){
        this.totalPlants = new Map();
    }
    // Used to add new plants to the state of the game, and update an existing plant's growth level.
    addPlantToState(plant){
        this.totalPlants.set(plant.position.stringify(), plant);
    }
    // Used when a plant is reaped.
    removePlantFromState(plant){
        assert(this.totalPlants.get(plant.position.stringify()), "Plant not found in Game State")

        if(this.totalPlants.get(plant.position)){
        this.totalPlants.delete(plant.position)
        }

    }
    // Prints the current state of all plants in the field.
    debugState(){
        this.totalPlants.forEach((value) => {
            console.log("[P]: Position: ", value.position, " Growth Level: ", value.growthLevel)
        })
    }
    getPlantAtPosition(position)
    {
        if(this.totalPlants.get(position)){
            return this.totalPlants.get(position)       
        }
    }
    // Returns true or false based on whether the game has been completed or not.
    checkWinCondition()
    {
        let gameWon = true;
        if (this.totalPlants.size < GameState.WINNING_PLANT_COUNT) gameWon = false;
        this.totalPlants.forEach((value) => {
            if(value.growthLevel < GameState.WINNING_GROWTH_LEVEL) gameWon = false;
        });
        return gameWon;
    }
}
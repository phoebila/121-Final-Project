// When a plant is created, reaped, or had its growth level increased, it needs to be represented in this.totalPlants
// Uses the Array of Structures format, got help from Brace on strategy.
class GameState{
    // If three or more plants are level three growth or above, the game is won.
    static WINNING_PLANT_COUNT = 3
    static WINNING_GROWTH_LEVEL = 3
    constructor(){
        this.plants = []
    }
    // Used to add new plants to the state of the game, and update an existing plant's growth level.
    addPlantToState(plant){
        if(this.plants.find(p=>p.position === plant.position)){
            this.plants.find(p=>p.position === plant.position).growthLevel = plant.growthLevel;    
        }
        else{
            this.plants.push({position:plant.position,growthLevel:plant.growthLevel})
        }
    }
    // Used when a plant is reaped.
    removePlantFromState(plant){
        const index = this.plants.findIndex(p => p.position === plant.position);
        assert(index != -1, "Invalid index used in removePlantFromState()");
        this.plants.splice(index,1)
    }
    // Prints the current state of all plants in the field.
    debugState(){
        this.plants.forEach((value) => {
            console.log("[P]: Position: ", value.position, " Growth Level: ", value.growthLevel)
        })
    }
    // Returns true or false based on whether the game has been completed or not.
    checkWinCondition()
    {
        let gameWon = true;
        if (this.plants.size < GameState.WINNING_PLANT_COUNT) gameWon = false;
        this.plants.forEach((value) => {
            if(value.growthLevel < GameState.WINNING_GROWTH_LEVEL) gameWon = false;
        });
        return gameWon;
    }
}
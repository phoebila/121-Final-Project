class Plant extends GridObj{
    constructor(species = null, growthLevel = 0, position){
        super(position, world)
        this.species = species;
        this.growthLevel = growthLevel;

        //binary representation of growth rules
        //0 = water, 1 = sun, 2 = max number of neighbors (player not included)
        this.growthRules = [0, 0, 0];
    }

    grow(){
        if (this.growthRules == checkCanGrow()){
            this.growthLevel++;
        }
    }

    checkCanGrow(){
        let growthReqs = [0, 0, 0];
        //check water
        growthReqs[0] = this.world.getTile(this.gridPosition).waterLvl > this.species.waterReq;
        //check sun
        growthReqs[1] = this.world.getTile(this.gridPosition).sunLvl > this.species.sunReq;
        //check neighbors
        
    growthReqs[]    }
}

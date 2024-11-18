class Plant extends GridObj{
    constructor(scene,species = null, growthLevel = 0, position){
        super(scene,position, world,sprite)
        this.species = species;
        this.growthLevel = growthLevel;

        //arra storing thresholds for growth
        //0 = water, 1 = sun, 2 = max number of plant neighbors (player not included)
        this.growthRules = [0, 0, 0];
    }

    init(){
        this.WATER_RULE = 0;
        this.SUN_RULE = 1;
        this.NEIGHBOR_RULE = 2;
    }

    grow(){
        if (checkCanGrow()){
            this.growthLevel++;
        }
    }

    checkCanGrow(){
        const tile = this.world.getTile(this.gridPosition)
        const waterReq = tile.waterLvl >=this.growthRules[this.WATER_RULE];
        const sunReq = tile.sunLvl >= this.growthRules[this.SUN_RULE];
        const adjReq = this.checkPlantNeighbors() < this.growthRules[this.NEIGHBOR_RULE];
        return (waterReq &&  //check water
            sunReq  &&  //check sun
            adjReq 
        );
    }

    checkPlantNeighbors(){
        let plantCount = 0;
        for(let dX = -1; dX < 1; dX++){
            for(let dY = -1; dY < 1; dY++){
                let posi = new Vector(this.gridPosition.x + dX, this.gridPosition.y + dY);
                let tileObj = this.world.getTile(posi).obj;
                if(tileObj != null && tileObj instanceof Plant){
                    plantCount++;
                }
            }
        }
    }
}

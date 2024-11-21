const plantSpecies = [
    'tree',
    'flower',
    'bush'
];

class Plant extends GridObj{
    constructor(scene, position, world, texture, species = null, water_req = 1, sun_req = 1, neighbor_req = 8){
        super(scene,position,world,texture)
        this.species = plantSpecies[Math.floor(Math.random()*3)];
        this.growthLevel = 0;

        this.WATER_RULE = water_req;
        this.SUN_RULE = sun_req;
        this.NEIGHBOR_RULE = neighbor_req
    }

    grow(){
        if (this.checkCanGrow()){
            this.growthLevel++;
            this.setTint(this.tint + 0xffb3b3);
            const tile =this.world.getTile(this.position)
            tile.waterLvl = tile.waterLvl - this.WATER_RULE;
        }
    }

    update(){
        this.grow();
    }

    checkCanGrow(){
        const tile = this.world.getTile(this.position)
        const waterReq = tile.waterLvl >= this.WATER_RULE;
        const sunReq = tile.sunLvl >= this.SUN_RULE;
        const adjReq = this.checkPlantNeighbors() < this.NEIGHBOR_RULE;
        return (waterReq &&  //check water
            sunReq  &&  //check sun
            adjReq 
        );
    }

    logCheckCanGrow(){
        const tile = this.world.getTile(this.position)

        console.log("Plant Rules: " + this.WATER_RULE + " " + this.SUN_RULE + " " + this.NEIGHBOR_RULE);
        console.log("Tile Water: " + tile.waterLvl);
        console.log("Tile Sun: " + tile.sunLvl);
        console.log("Plant Neighbors: " + this.checkPlantNeighbors());
    }

    checkPlantNeighbors(){
        let plantCount = 0;
        for(let dX = -1; dX < 1; dX++){
            for(let dY = -1; dY < 1; dY++){
                if(dX == 0 && dY == 0){
                    continue;
                }
                let posi = new Vector(this.position.x + dX, this.position.y + dY);
                let tileObj = this.world.getTile(posi).obj;
                if(tileObj != null && tileObj instanceof Plant){
                    plantCount++;
                }
            }
        }
        return plantCount;
    }
}

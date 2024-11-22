class Plant extends GridObj {
    constructor(scene, species = null, growthLevel = 0, position, world) {
        const sprite = "flower"; // Placeholder texture name
        super(scene, position, world, sprite);
        this.species = species;
        this.growthLevel = growthLevel;

        // Array storing thresholds for growth
        // 0 = water, 1 = sun, 2 = max number of plant neighbors (player not included)
        this.growthRules = [0, 0, 0];

        this.init();
    }

    init() {
        this.WATER_RULE = 0;
        this.SUN_RULE = 1;
        this.NEIGHBOR_RULE = 2;
    }

    grow() {
        if (this.checkCanGrow()) {
            this.growthLevel++;
        }
    }

    checkCanGrow() {
        const tile = this.world.getTile(this.position);
        
        // Check if the tile has sufficient water and sun
        const waterReq = tile.waterLvl >= this.growthRules[this.WATER_RULE];
        const sunReq = tile.sunLvl >= this.growthRules[this.SUN_RULE];
        
        // Check if the tile has too many neighboring plants
        const adjReq = this.checkPlantNeighbors() < this.growthRules[this.NEIGHBOR_RULE];
        
        // The plant can grow if water, sun, and neighbor requirements are met
        return waterReq && sunReq && adjReq;
    }

    checkPlantNeighbors() {
        let plantCount = 0;
        for (let dX = -1; dX <= 1; dX++) {
            for (let dY = -1; dY <= 1; dY++) {
                if (dX === 0 && dY === 0) continue; // Skip the current tile
                const posi = new Vector(this.position.x + dX, this.position.y + dY);
                const tileObj = this.world.getTile(posi)?.obj;
                if (tileObj instanceof Plant) {
                    plantCount++;
                }
            }
        }
        return plantCount;
    }


}

// Cell ()
// Grid ()
// Plant ()

class Vector {
    constructor(x = 0 ,y = 0){
        this.x = x;
        this.y = y;
    }

    add(other){ return( new Vector( this.x + other.x, this.y + other.y)) }
    minus(other){ return( new Vector( this.x - other.x, this.y - other.y)) }
    copy(){ return (new Vector( this.x, this.y)) }
}

class Tile {
    constructor(obj = null, waterLvl = 0, sunLvl = 0) {
        this.obj = obj;
        this.waterLvl = waterLvl;
        this.sunLvl = sunLvl;
    }
}

class GridObj exttends Phaser.sprite{
    constructor(position, world){
        this.world = world;
        this.gridPosition = position.copy();
        this.world.popTile(this.gridPosition, this)
    }
}

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
        
rowthReqs[]    }
}

class World{
    constructor(scene, width, height) {
        this.gridSize = new Vector(width, height)
        this.scene = scene;
        this.grid = []
        for (let y = 0; y < this.gridSize.y; y++) {
            for (let x = 0; x < this.gridSize.x; x++) {
                if (this.grid[x] == null) {
                    this.grid[x] = [];
                }
                this.grid[x][y] = new Tile()
            }
        }
    }

    getTile(pos) {
        return (this.grid[pos.x] && this.grid[pos.x][pos.y]) || null;
    }
    
    popTile(pos, arg){
        this.getTile(pos).obj = arg;
    }

    dePopTile(pos){
        this.getTile(pos).obj = null;
    }
    
    checkEnterable(pos){
        const tile = this.getTile(pos);
        if (tile && tile.obj){
            return true;
        }
        return false;
    }

    generateRandomWeather(){
        for (let y = 0; y < this.gridSize.y; y++) {
            for (let x = 0; x < this.gridSize.x; x++) {
                let tile = this.getTile(new Vector(x, y));
                //water level can be stored up, sun level cannot per F0.d
                tile.waterLvl = tile.waterLvl + Math.random();
                tile.sunLvl = Math.random();
            }
        }
    }
}

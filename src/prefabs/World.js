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

class GridObj{
    constructor(position, world){
        this.world = world;
        this.position = position.copy();
        this.world.popTile(this.position, this)
    }
}

class Plant extends GridObj{
    constructor(species = null, growthLevel = 0, position){
        super(position, world)
        this.species = species;
        this.growthLevel = growthLevel;
    }
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
    
    checkEnterable(p{
        this.getTile(pos)
        if ()
    }

    randomWeather(){
        for (let y = 0; y < this.gridSize.y; y++) {
            for (let x = 0; x < this.gridSize.x; x++) {
                let tile = this.getTile(new Vector(x, y));
                //water level can be stored up, sun l
                tile.waterLvl = tile.waterLvl + Math.random();
                tile.sunLvl = Math.random();
            }
        }
    }
}

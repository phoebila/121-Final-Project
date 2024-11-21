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

class GridObj extends Phaser.GameObjects.Sprite{
    constructor(scene,position, world, texture){
        const trueX = position.x * world.tileSize;
        const trueY =  position.y * world.tileSize;
        super(scene, trueX, trueY, texture);

        this.position = position.copy();
        this.world = world;
        this.position = position.copy();
        this.world.popTile(this.position, this)
        this.walking = false;

        scene.add.existing(this)
    }


    move(dir) {
        const target = this.position.add(dir);
        this.walking = true
        if (!this.world.checkEnterable(target)) {
            this.walking = false
            return false
        }
        const startingPosition = this.position.copy();
        this.world.popTile(target, this);
        this.position = target.copy();
        this.x = this.position.x * this.world.tileSize;
        this.y = this.position.y * this.world.tileSize;
        
        this.world.dePopTile(startingPosition);
        this.walking = false;
        return true;
    }
}


class World{
    constructor(scene, width, height, tileSize) {
        this.tileSize = tileSize
        this.gridSize = new Vector(width, height)
        this.scene = scene;
        this.grid = []
        for (let x = 0; x < this.gridSize.y; x++) {
            this.grid[x] = [];
            for (let y = 0; y < this.gridSize.x; y++) {
                this.grid[x][y] = new Tile()
            }
        }
    }

    getTile(pos) {
        const grid = this.grid;
        return (grid && this.grid[pos.x] && this.grid[pos.x][pos.y]) || null;
    }
    
    popTile(pos, arg){
        this.getTile(pos).obj = arg;
    }

    dePopTile(pos){
        this.getTile(pos).obj = null;
    }
    
    checkEnterable(pos){
        const tile = this.getTile(pos);
        if (tile && !tile.obj){
            return true;
        }
        return false;
    }

    generateRandomWeather(){
        for (let y = 0; y < this.gridSize.y; y++) {
            for (let x = 0; x < this.gridSize.x; x++) {
                let tile = this.getTile(new Vector(x, y));
                //water level can be stored up, sun level cannot per F0.d
                tile.waterLvl = tile.waterLvl + Math.floor(Math.random()*3);
                tile.sunLvl = Math.floor(Math.random()*3);
            }
        }
    }

    generateWeather(waterLvl, sunLvl){
        for (let y = 0; y < this.gridSize.y; y++) {
            for (let x = 0; x < this.gridSize.x; x++) {
                let tile = this.getTile(new Vector(x, y));
                tile.waterLvl += waterLvl;
                tile.sunLvl = sunLvl;
            }
        }
    }
}

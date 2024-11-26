class Componenet {
    constructor(parent){
        this.parent = parent;
    }
}

class MoveComp extends Componenet{
    constructor(parent){
        super(parent)

        this.targetGridPosition = new Vector(0,0);
        this.startGridPosition = new Vector(0,0);
        this.trueTargetPosition = new Vector(0,0);
        this.callback = null;
        this.world = this.parent.world;
        this.walking = false;
    }

    startMoving(callback){
        if (!this.walking){
            this.walking = true;
            this.callback = callback;
            this.speedVector = this.parent.direction.mult(2);
            this.startGridPosition = this.parent.position.copy();
            this.targetGridPosition = this.parent.position.add(this.parent.direction);
            this.trueTargetPosition.x = this.targetGridPosition.x * this.world.tileSize;
            this.trueTargetPosition.y = this.targetGridPosition.y * this.world.tileSize;
    
            if ( !this.world.checkEnterable(this.targetGridPosition, this.parent)){
                console.log("cannot walk here");
                this.parent.sm.changeState("idle");
                return;
            }
            this.world.popTile(this.targetGridPosition, this.parent);
        }

        

        
    }

    update(time,delta){
        moveRoutine();
    }


    moveRoutine(){
        for (let axis of ['x','y']){
            
            if ( ( ( this.parent[axis] > this.trueTargetPosition[axis] ) && ( this.parent.direction[axis] > 0 ) ) ||
            ( ( this.parent[axis] < this.trueTargetPosition[axis] ) && ( this.parent.direction[axis] < 0 ) )   ){
                this.parent.x = this.trueTargetPosition.x;
                this.parent.y = this.trueTargetPosition.y;
                this.world.dePopTile(this.startGridPosition, this.parent)
                this.callback && this.callback();
                this.walking = false;
                return;
            } else {
                this.parent[axis] += this.speedVector[axis];
            }
        }
        
    }
}
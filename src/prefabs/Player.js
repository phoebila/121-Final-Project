class Player extends GridObj {
    constructor(scene,position,sprite) {
        super(scene,position,scene.world, sprite );
        this.waitTime = 200
        this.timer = 0;

        this.setOrigin(0)
    }

    update(time, delta) {
        // Listen for inputs and move the player
        if ( this.timer <= 0){
            if (cursors.left.isDown) {
                this.move(new Vector(-1, 0));
            } else if (cursors.down.isDown) {
                this.move(new Vector(0, 1));
            } else if (cursors.up.isDown) {
                this.move(new Vector(0, -1));
            } else if (cursors.right.isDown) {
                this.move(new Vector(1, 0));
            } 
        } else {
            this.timer -= delta;
        }
        
    }

    move(dir){
        super.move(dir)
        this.timer = this.waitTime
    }


    // Increment world time 
        // Change state of weather on the grid
        // Increment / Deincrement water levels
        // Add / Remove sunlit status
    tick() {

    }

    // Harvest plant
        // Check tile in the direction that the player is facing.
        // Check plant growth
    reap() {

    }

    // Plant seed
        // Check tile in the direction that the player is facing.
        // Create plant, add tile to its tile field
        // Assign plant to tile's obj field
    sow() {

    }

}
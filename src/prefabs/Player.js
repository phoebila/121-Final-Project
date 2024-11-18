class Player extends gridObj {
    constructor(position, scene, texture) {
        super(position,world);


        
        scene.add.existing(this);
        scene.physics.add.existing(this);
    }


    move(target) {
        /*
        Check if target tile populatable
        if not, return false

        if enterable,
        set new tile to be populated by the player
        telport the player sprite there
        set player grid position there.
        depopulate player's original tile.
        */ 
        if (!this.world.checkEnterable(target)) {
            return false
        }
        const startingPos = this.gridPos;
        this.world.popTile(target, this);
        this.position = target.copy();
        this.world.dePopTile(startingPos);

        return true;
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








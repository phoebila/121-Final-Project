class StateMachine {
    
    constructor(parent){
        this.parent =  parent;
        this.states = {};
        this.currentState = null;
        this.stateNames = [];
        this.updateable = false;
    }
    addState(arg){
        this.stateNames.push(arg.name)
        this.states[arg.name] = arg;
    }
    changeState(key){
        
        const newState = this.states[key];
        if (!(newState)){
            console.log("Invalid state!");
            return(false);
        } 
        if (newState === this.currentState){
            //console.log("Already in state!");
            return(false);
        } 
        if ( this.states[this.currentState]){     // don't exit a state that doesn't exist!
            this.states[this.currentState].exit();
        }
        this.currentState = newState;
        this.currentState.enter();
    }
    update(time,delta){
        this.currentState && this.currentState.update(time,delta);
    }
}
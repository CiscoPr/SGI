import * as THREE from 'three';

class CarController{

    constructor(model, app){
        this.model = model;
        this.app = app;
        this.state = 'idle';
        this.speed = 0;
        this.maxSpeed = 5;
        this.acceleration = 0.1;
        this.deceleration = 0.1;
        this.direction = 0;
        this.turnSpeed = 0.05;
        this.turnDirection = 0;
        this.turning = false;
    }

    setState(newState) {
        this.state = newState;
        this.handleState();
    }

    handleState() {
        switch (this.state) {
            case 'idle':
                this.idle();
                break;
            case 'accelerate':
                this.accelerate();
                break;
            case 'decelerate':
                this.decelerate();
                break;
            case 'turn':
                this.turn();
                break;
            default:
                console.log('Invalid state');
        }
    }

    idle() {
        console.log('Car is idle');
        // Add code for idle state
    }

    accelerate() {
        console.log('Car is accelerating');
        // Add code for accelerate state
        if(this.speed < this.maxSpeed){
            this.speed += this.acceleration;
        }
    }

    decelerate() {
        console.log('Car is decelerating');
        // Add code for decelerate state
        if(this.speed > 0){
            this.speed -= this.deceleration;
        }
    }

    turn() {
        console.log('Car is turning');
        // Add code for turn state
        if(this.turning){
            this.model.rotateY(this.turnDirection * this.turnSpeed);
        }
    }

    update(){
        this.model.translateZ(this.speed);
        this.model.rotateY(this.direction);
    }

    

} export {CarController};
import * as THREE from 'three';

class CarController {
    constructor(model, wheels, track, maxSpeed, acceleration, brakeSpeed) {
        // objects to control
        this.model = model;
        this.wheels = wheels;

        // track record
        this.track = track;

        // timestamp
        this.lastTime = null;
        this.lastPos = this.model.position.clone();

        // timers
        this.collisionEffect = 0;
        this.raceTime = 0;

        // default values for car parameters
        this.maxSpeedDefault = maxSpeed;

        // car parameters
        this.speed = 0;
        this.realSpeed = 0;
        this.maxSpeed = this.maxSpeedDefault;
        this.acceleration = acceleration;
        this.deceleration = 0.5;
        this.brakeSpeed = brakeSpeed;
        this.turnSpeed = 0;
        this.maxTurnSpeed = 0.03;
        this.direction = 1;
        this.turnDirection = 0;

        // event flags
        this.accelerating = false;
        this.sIsPressed = false;
        this.turning = false;
        this.outTracks = false;
        this.pause = false;

        // Add event listeners for keypresses
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'w':
                this.accelerating = true;
                this.direction = 1;
                this.accelerate();
                break;
            case 's':
                this.sIsPressed = true;
                //this.accelerating = true;
                //this.direction = -1;
                this.sAccelerate();
                break;
            case 'a':
                this.turnDirection = 1;
                this.turn();
                break;
            case 'd':
                this.turnDirection = -1;
                this.turn();
                break;
        }
    }

    handleKeyUp(event) {
        switch (event.key) {
            case 'w':
                this.accelerating = false;
                this.decelerate();
                break;
            case 's':
                this.sIsPressed = false;
                this.accelerating = false;
                this.sDecelerate();
                break;
            case 'a':
                this.turning = false;
                this.turnDirection = 0;
                this.decelerate();
                break;
            case 'd':
                this.turning = false;
                this.turnDirection = 0;
                this.decelerate();
                break;
        }
    }

    /*
    const time = (Date.now() % 6000) / 6000;
        for (let i = 0; i < this.carCloudWheels.children.length; i++) {
          const wheel = this.carCloudWheels.children[i];
          wheel.center = new THREE.Vector3(0, 0, 0);
          wheel.rotation.x = time * Math.PI * 2;
        }
    */

    accelerate() {

        if (this.speed < this.maxSpeed && this.turnSpeed < this.maxTurnSpeed) {
            this.speed += this.acceleration;
            this.turnSpeed += 0.001;
        }
        else{
            this.speed = this.maxSpeed;
            this.turnSpeed = this.maxTurnSpeed;
        }
    }

    sAccelerate() {
        console.log("sAccelerate", this.speed, this.turnSpeed)
        if (this.speed > 0 && this.turnSpeed > 0) {
            this.speed -= this.brakeSpeed;
            this.turnSpeed -= 0.006;
        }
        else if(this.speed <= 0 && this.turnSpeed <= 0){
            this.speed -= this.deceleration;
            this.turnSpeed -= 0.001;
            if(this.speed < -this.maxSpeed && this.turnSpeed < -this.maxTurnSpeed){
                this.speed = -this.maxSpeed;
                this.turnSpeed = -this.maxTurnSpeed;
            }
        }

    }

    sDecelerate() {
        if (this.speed < 0 && this.turnSpeed < 0) {
            this.speed += this.deceleration;
            this.turnSpeed += 0.001;
        }
        else{
            this.speed = 0;
            this.turnSpeed = 0;
        }
    }

    decelerate() {

        if (this.speed > 0 && this.turnSpeed > 0) {
            this.speed -= this.deceleration;
            this.turnSpeed -= 0.001;
        }
        else if(!this.sIsPressed){
            this.speed = 0;
            this.turnSpeed = 0;
        }
    }

    turn() {
        this.turning = true;
    }

    boostCollision(type) {
        switch (type) {
            case 'speed':
                this.maxSpeed = this.maxSpeedDefault * 2;
                this.collisionEffect = 5000;
                break;
            case 'time':
                this.raceTime -= 3000;
                if (this.raceTime < 0) this.raceTime = 0;
            default:
                break;
        }
    }

    obstacleCollision(type) {
        switch (type) {
            case 'speed':
                this.maxSpeed = this.maxSpeedDefault * 0.70;
                this.collisionEffect = 5000;
                break;
            case 'time':
                this.raceTime += 3000;
            default:
                break;
        }
    }

    updateCollisionEffect() {
        let elapsedTime = Date.now() - this.lastTime;

        if (this.collisionEffect > 0) this.collisionEffect -= elapsedTime;
        else {
            this.maxSpeed = this.maxSpeedDefault;
            this.collisionEffect = 0;
        }
    }

    updateRaceTime() {
        let elapsedTime = Date.now() - this.lastTime;
        this.raceTime += elapsedTime;

        //console.log("hello", this.raceTime);
    }

    updateRealSpeed() {
        let elapsedTime = Date.now() - this.lastTime;
        elapsedTime = elapsedTime / 3600000;
        this.realSpeed = (this.model.position.distanceTo(this.lastPos) / 1000) / elapsedTime;
        this.lastPos = this.model.position.clone();
    }

    updatePosition() {
        if (this.accelerating) {
            this.accelerate();
        } else if (!this.accelerating && this.speed > 0) {
            this.decelerate();
        }else if(this.sIsPressed){
            this.sAccelerate();
        }
        else if(!this.sIsPressed && this.speed < 0){
            this.sDecelerate();
        }
        if (this.turning && this.accelerating) {
            this.model.rotateY(this.turnDirection * this.turnSpeed);
        }
        else if (this.turning && !this.accelerating) {
            this.decelerate();
            this.model.rotateY(this.turnDirection * this.turnSpeed);
        }

        this.model.translateZ(this.speed * this.direction);
    }

    updateWheels() {
        const time = (Date.now() % 6000) / 6000;
        const turn = this.turnDirection * this.turnSpeed;
        const turnAngle = turn * Math.PI/2 ; // Adjust this value to get the desired turn angle

        for (let i = 0; i < this.wheels.children.length; i++) {
            const wheel = this.wheels.children[i];
            wheel.center = new THREE.Vector3(0, 0, 0);
            //wheel.rotation.x = time * Math.PI * 5 * speed;
            //console.log("my angle", turnAngle)
            // If the wheel is a front wheel, set its y rotation based on the turn direction
            if ((wheel.name === "topLeftWheel" || wheel.name === "topRightWheel")) {
              if(turnAngle !== 0){
                wheel.rotation.y = turnAngle;
              }
              else{
                wheel.rotation.y = 0;
                wheel.rotation.x = time * Math.PI * 5 * this.speed;
              }
            }else{
              wheel.rotation.x = time * Math.PI * 5 * this.speed;
            }
        }
    }

    checkOutOfTrack() {
        const arrayPoints = this.track.path1.getSpacedPoints(10000);

        //console.log("arrayPoints", arrayPoints);
        let closestPointIndex = 0;
        let closestPointDistance = arrayPoints[0].distanceTo(this.model.position);

        for(let i = 0; i < arrayPoints.length; i++){
            //get the closest point
            let currentDistance = arrayPoints[i].distanceTo(this.model.position);
            if(currentDistance < closestPointDistance){
                closestPointIndex = i;
                closestPointDistance = currentDistance;
            }
            }
        //console.log("closestPoint", closestPointDistance);
        // ask about this
        if(closestPointDistance > 250 || ((this.model.position.x > 4300 || this.model.position.x < 3700) && (this.model.position.z < 0 && this.model.position.z > -2000 ))){
            console.log("you're out of the track");
            this.outTracks = true;
            this.maxSpeed = this.maxSpeedDefault * 0.5;
        }
        else{
            // fix the max speed
            if (this.collisionEffect == 0) this.maxSpeed = this.maxSpeedDefault;
            console.log("you're in the track");
            this.outTracks = false;
        }
    }

    updateClock() { this.lastTime = Date.now(); console.log("lastTime", this.lastTime);}

    update() {
        if (this.lastTime == null) { this.lastTime = Date.now(); return; }

        if (!this.pause) {
            this.updatePosition();
            this.updateWheels();
            this.updateCollisionEffect();
            this.checkOutOfTrack();
            this.updateRaceTime();
            this.updateRealSpeed();
        }

        // update timestamp
        this.updateClock();
    }
}

export { CarController };
import * as THREE from 'three';

class CarController {
    constructor(model) {
        this.model = model;
        this.speed = 0;
        this.maxSpeed = 10;
        this.acceleration = 0.5;
        this.accelerating = false;
        this.deceleration = 0.5;
        this.turnSpeed = 0;
        this.maxTurnSpeed = 0.03;
        this.direction = 1;
        this.turning = false;
        this.turnDirection = 0;
        this.pointLightBack = null;
        this.pointLightFront = null;
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
                this.accelerating = true;
                this.direction = -1;
                this.decelerate();
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
                this.accelerating = false;
                this.decelerate();
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

    decelerate() {

        if (this.speed > 0 && this.turnSpeed > 0) {
            this.speed -= this.deceleration;
            this.turnSpeed -= 0.001;
        }
        else{
            this.speed = 0;
            this.turnSpeed = 0;
        }
        console.log(this.turnSpeed);
    }

    turn() {
        this.turning = true;
    }

    update() {
        if (this.accelerating) {
            this.accelerate();
        } else if (!this.turning && this.speed > 0) {
            this.decelerate();
        }


        if (this.turning) {
            this.model.rotateY(this.turnDirection * this.turnSpeed);

        }

        this.model.translateZ(this.speed * this.direction);
        return [this.speed, this.turnSpeed * this.turnDirection];

    }
}

export { CarController };
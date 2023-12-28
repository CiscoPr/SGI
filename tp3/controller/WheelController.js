import * as THREE from 'three';

class WheelController {
    constructor(time, model, wheels, currentAngle, nextAngle){
        this.time = time;
        this.model = model;
        this.wheels = wheels;
        this.currentAngle = currentAngle;
        this.nextAngle = nextAngle;
        this.wheelRotation = 0;
        this.wheelRotationSpeed = 0.5;
    }

    update() {
        const time = (Date.now() % 6000) / 6000;
        this.wheelRotation += this.wheelRotationSpeed  *time * 100 ;

        this.wheels.children[0].rotation.x = this.wheelRotation;
        this.wheels.children[1].rotation.x = this.wheelRotation;


        let topRightWheel = this.wheels.children[2];
        let topLeftWheel = this.wheels.children[3];

        if(this.currentAngle < this.nextAngle){
            topRightWheel.rotation.y = 0.1;
            topLeftWheel.rotation.y = 0.1;
        }
        else if(this.currentAngle > this.nextAngle){
            topRightWheel.rotation.y = -0.1;
            topLeftWheel.rotation.y = -0.1;
        }
        else{
            topRightWheel.rotation.y = 0;
            topLeftWheel.rotation.y = 0;
            this.wheels.children[2].rotation.x = this.wheelRotation;
            this.wheels.children[3].rotation.x = this.wheelRotation;
        }
    }
} export { WheelController };
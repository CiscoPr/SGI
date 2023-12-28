import * as THREE from 'three';

class AutomaticCarController {
    constructor(model, wheels, track) {
        this.model = model;
        this.wheels = wheels;
        this.track = track;
        this.speed = 0;
        this.maxSpeed = 10;
        this.acceleration = 0.5;
        this.accelerating = false;
        this.sIsPressed = false;
        this.deceleration = 0.5;
        this.turnSpeed = 0;
        this.maxTurnSpeed = 0.03;
        this.direction = 1;
        this.turning = false;
        this.turnDirection = 0;

        this.clock = new THREE.Clock();
        this.mixerTime = 0;
        this.mixerPause = false;


    }

    init(){
        this.debugKeyFrames();
        const positionKF = new THREE.VectorKeyframeTrack('.position', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], [
            ...this.keyPoints[0],
            ...this.keyPoints[1],
            ...this.keyPoints[2],
            ...this.keyPoints[3],
            ...this.keyPoints[4],
            ...this.keyPoints[5],
            ...this.keyPoints[6],
            ...this.keyPoints[7],
            ...this.keyPoints[8],
            ...this.keyPoints[9],
            ...this.keyPoints[10]
        ],
        THREE.InterpolateSmooth
        )


    }

    debugKeyFrames(){
        let spline = new THREE.CatmullRomCurve3([...this.keyPoints]);

        // Setup visual control points

        for (let i = 0; i < this.keyPoints.length; i++) {
            const geometry = new THREE.SphereGeometry(100, 32, 32)
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
            const sphere = new THREE.Mesh(geometry, material)
            sphere.position.set(... this.keyPoints[i])

            this.app.scene.add(sphere)
        }

        const tubeGeometry = new THREE.TubeGeometry(spline, 100, 0.05, 10, false)
        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)

        return tubeMesh
    }

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
            this.speed -= this.deceleration * 6;
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

    update() {
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



        if (this.turning) {
            this.model.rotateY(this.turnDirection * this.turnSpeed);

        }

        this.model.translateZ(this.speed * this.direction);
        return [this.speed, this.turnSpeed * this.turnDirection];

    }
}

export { AutomaticCarController };
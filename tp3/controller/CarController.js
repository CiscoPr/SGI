class CarController {
    constructor(model) {
        this.model = model;
        this.speed = 0;
        this.maxSpeed = 5;
        this.acceleration = 0.1;
        this.accelerating = false;
        this.deceleration = 0.1;
        this.turnSpeed = 0;
        this.maxTurnSpeed = 0.05;
        this.direction = 1;
        this.turning = false;
        this.turnDirection = 0;
        this.pointLightBack = null;
        this.pointLightFront = null;
        // Add event listeners for keypresses
        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('keyup', (e) => this.handleKeyUp(e));
        /*
              // add a point light on the back of the model
      this.pointLightBack = new THREE.PointLight(0xffffff, 900, 20);
      this.pointLightBack.position.set(this.carCloudWheels.position.x, this.carCloudWheels.position.y + 10, this.carCloudWheels.position.z-5);
      this.app.scene.add(this.pointLightBack);
      // add a point light helper for the previous point light
      //const sphereSizeBack = 0.5;
      //const pointLightBackHelper = new THREE.PointLightHelper(pointLightBack, sphereSizeBack);
      //this.app.scene.add(pointLightBackHelper);

      // add a point light on th front of the model
      this.pointLightFront = new THREE.PointLight(0xffffff, 900, 20);
      this.pointLightFront.position.set(this.carCloudWheels.position.x, this.carCloudWheels.position.y + 10, this.carCloudWheels.position.z+15);
      this.app.scene.add(this.pointLightFront);
      // add a point light helper for the previous point light
      const sphereSizeFront = 0.5;
      const pointLightFrontHelper = new THREE.PointLightHelper(pointLightFront, sphereSizeFront);
      //this.app.scene.add(pointLightFrontHelper);
        */
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
                this.decelerate();
                break;
            case 'd':
                this.turning = false;
                this.decelerate();
                break;
        }
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
        console.log("my speed", this.speed)
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

    }
}

export { CarController };
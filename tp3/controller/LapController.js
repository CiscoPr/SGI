import * as THREE from 'three';

class LapController{
    constructor(app, car, track){
        this.app = app;
        this.car = car;
        this.track = track;
        this.lap = 0;
        this.lapTime = 0;
        this.lapTimes = [];
        this.lapTimesString = [];
        this.lapTimesString.push("Lap Times:");
        this.checkpoints = [];
        this.points = this.track.path1.getSpacedPoints(20);
        this.goal = this.points[0];
        this.startTime = -1;
        this.endTime = -1;
        this.init();

        // helpers
        this.carSphere;
    }

    init(){
        // build helpers
        const geometry = new THREE.SphereGeometry(this.car.radius);
        const material = new THREE.MeshBasicMaterial({color: 0xffff00});
        material.wireframe = true;
        this.carSphere = new THREE.Mesh(geometry, material);
        //this.app.scene.add(this.carSphere);

        for(let i = 1; i < this.points.length; i++){
            this.checkpoints.push(false);
        }
        console.log("Lap Controller Initialized");
        console.log(this.checkpoints);
        console.log(this.points);
        const goalBox = new THREE.Mesh(new THREE.BoxGeometry(500, 50, 50), new THREE.MeshBasicMaterial({color: 0x00ff00}));
        this.goal.y += 50;
        this.goal.z -= 50;
        goalBox.position.set(this.goal.x, this.goal.y, this.goal.z);
        //this.app.scene.add(goalBox);
        for(let i = 1; i < this.points.length; i++){
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(300, 10, 10), new THREE.MeshBasicMaterial({color: 0xff0000}));
            sphere.position.set(this.points[i].x, this.points[i].y, this.points[i].z);
            //this.app.scene.add(sphere);
        }

        // lap plane
        const lapPlane = new THREE.Mesh(new THREE.PlaneGeometry(450, 100), new THREE.MeshBasicMaterial({color: 0xffffff}));
        lapPlane.rotation.x = -Math.PI/2;
        lapPlane.position.set(this.goal.x, this.goal.y-24.5, this.goal.z);
        // apply texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load('./scene/textures/elements/goal.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(3, 1);
        lapPlane.material.map = texture;
        lapPlane.material.side = THREE.DoubleSide;
        this.app.scene.add(lapPlane);
    }

    update(){
        if (this.startTime === -1) this.startTime = Date.now();

        if (this.carSphere != null ){
            let chassisCenter = this.car.getChassisCenter();
            let x = chassisCenter.x;
            let y = chassisCenter.y;
            let z = chassisCenter.z;
            this.carSphere.position.set(x, y, z);
            //console.log("spherePos", this.carSphere.position)
        }
        // checks if the car has passed through a checkpoint
        for(let i = 1; i < this.points.length; i++){
            if(this.carSphere.position.distanceTo(this.points[i]) <= 300){
                if(i > 1){
                    if(this.checkpoints[i-2] === true) this.checkpoints[i-1] = true;
                }
                else this.checkpoints[i-1] = true;


                //console.log("checkpoint " + i + " reached");
                //console.log(this.checkpoints);
            }
        }

        // checks if the car has passed through all checkpoints
        if(this.checkpoints.every(checkpoint => checkpoint === true) &&
            (this.carSphere.position.x <= this.goal.x + 250 && this.carSphere.position.x >= this.goal.x - 250) &&
            (this.carSphere.position.z <= this.goal.z + 25 && this.carSphere.position.z >= this.goal.z - 25)){
            this.lap++;
            if (this.lap === 3) this.endTime = Date.now() - this.startTime;
            console.log("lap " + this.lap + " reached");
            for(let i = 0; i < this.checkpoints.length; i++){
                this.checkpoints[i] = false;
            }
            //console.log(this.checkpoints);
        }

    }
}
export { LapController };

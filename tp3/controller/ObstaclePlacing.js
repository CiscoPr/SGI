import * as THREE from 'three';
import { MyObstacle } from '../components/MyObstacle.js';
import { MyShader } from '../components/MyShader.js';


class ObstaclePlacing{
    constructor(app, obsName) {
        this.app = app;
        this.obsName = obsName;

        this.mousePressed = false;
        this.escapePressed = false;
		this.shadermesh = null;

        this.obstacle = null;

        this.obsPlacerDone = false;

        this.pointer = new THREE.Vector2();

        // intersection point between the ray and the plane
        this.intersectionPoint = new THREE.Vector3();

        // normal of the plane
        this.planeNormal = new THREE.Vector3();

        // plane used for the raycaster in front of the camera
        this.plane = new THREE.Plane();

        this.raycaster = new THREE.Raycaster();


        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'Escape':
                this.escapePressed = true;
                break;
        }
    }

    getEscapePressed(){
        return this.escapePressed;
    }

    handleMouseDown(event) {
        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // set the plane normal to the camera position
        this.planeNormal.copy(this.app.activeCamera.position).normalize();

        //create the plane
        this.plane.setFromNormalAndCoplanarPoint(this.planeNormal, this.app.scene.position);

        // set the raycaster origin to the camera position
        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);

        // get the intersection point between the ray and the plane
        this.raycaster.ray.intersectPlane(this.plane, this.intersectionPoint);

        if(this.escapePressed || this.obsPlacerDone) return;
        switch (event.button) {
            case 0:
                this.mousePressed = true;
                console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);
                if(this.pointer.x > -0.42 && this.pointer.x < 0.335 && this.pointer.y > -0.94 && this.pointer.y < 0.95){

                    if(this.obsName == 'speed'){
                        this.shadermesh = new MyShader(this.app, "shader", "no description provided", "shaders/obstacle.vert", "shaders/obstacle.frag", {
                            time: {type:'f', value: 0.0 },
                            radius: {type:'f', value: 20.0},
                            color: {type: 'vec4', value: new THREE.Vector4(255.0, 0.0, 0.0, 1.0)},
                        });
                    }else{
                        this.shadermesh = new MyShader(this.app, "shader", "no description provided", "shaders/obstacle.vert", "shaders/obstacle.frag", {
                            time: {type:'f', value: 0.0 },
                            radius: {type:'f', value: 20.0},
                            color: {type: 'vec4', value: new THREE.Vector4(255.0, 165.0, 0.0, 1.0)},
                        });
                    }

                    setTimeout(()=>{
                        this.obstacle = new MyObstacle(this.obsName, new THREE.Vector3(this.intersectionPoint.x, 45, this.intersectionPoint.z), this.app.scene);
                        this.obstacle.helper.children[0].material = this.shadermesh.material;
                        this.obstacle.helper.children[0].needsUpdate = true;
                    }, 3000);

                    console.log("Obstacle placed");
                    this.obsPlacerDone = true;
                }
                else{
                    console.log("Can't place obstacle here")
                }

                break;
        }
    }




} export { ObstaclePlacing };
import * as THREE from 'three';

class MyTrack {
    /**
     * constructs the object
     * @param {THREE.Scene} scene The application scene
     */
    constructor(scene) {
        this.scene = scene;
        this.segments = 100;
        this.width = 300;
        this.textureRepeat = 20;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = true;
        this.closedCurve = true;

        this.path1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(4000, 0, 0),
            new THREE.Vector3(4000, 0, 6000),
            new THREE.Vector3(-1500, 0, 6000),
            new THREE.Vector3(-4000, 0, 6000),
            new THREE.Vector3(-4000, 0, 2000),
            new THREE.Vector3(2000, 0, 2000),
            new THREE.Vector3(2000, 0, -1000),
            new THREE.Vector3(-5000, 0, -1000),
            new THREE.Vector3(-5000, 0, -5000),
            new THREE.Vector3(3000, 0, -5000),
            new THREE.Vector3(4000, 0, -3500),
            new THREE.Vector3(4000, 0, -2000),
        ]);




        this.buildCurve();
    }

    /**
     * Creates the necessary elements for the curve
     */
    buildCurve() {
        this.createCurveMaterialsTextures();
        this.createCurveObjects();
    }

    /**
     * Create materials for the curve elements: the mesh, the line and the wireframe
     */
    createCurveMaterialsTextures() {
        const texture = new THREE.TextureLoader().load("scene/textures/elements/track.jpg");
        texture.wrapS = THREE.RepeatWrapping;

        this.material = new THREE.MeshBasicMaterial({ map: texture });
        this.material.map.repeat.set(10, 3);
        this.material.map.wrapS = THREE.RepeatWrapping
        this.material.map.wrapT = THREE.RepeatWrapping;

        this.wireframeMaterial = new THREE.MeshBasicMaterial({
        color: 0x0000ff,
        opacity: 0.3,
        wireframe: true,
        transparent: true,
        });

        this.lineMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    }

    /**
     * Create the curve objects: the mesh, the line and the wireframe
     */
    createCurveObjects() {

        // 1st curve
        let geometry = new THREE.TubeGeometry(
        this.path1,
        this.segments,
        this.width,
        3,
        this.closedCurve
        );

        this.mesh = new THREE.Mesh(geometry, this.material);
        this.mesh.castShadow = true;
        this.mesh.receiveShadow = true;
        this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);

        let points = this.path1.getPoints(this.segments);
        let bGeometry = new THREE.BufferGeometry().setFromPoints(points);
        // Create the final object to add to the scene
        this.line = new THREE.Line(bGeometry, this.lineMaterial);


        this.curve = new THREE.Group();

        this.mesh.visible = this.showMesh;
        this.wireframe.visible = this.showWireframe;
        this.line.visible = this.showLine;



        this.curve.add(this.mesh);
        this.curve.add(this.wireframe);
        this.curve.add(this.line);


        this.curve.scale.set(1, -0.2, 1);
        this.curve.position.set(0, -5.1, 0);
        this.scene.add(this.curve);
    }
}
export { MyTrack };
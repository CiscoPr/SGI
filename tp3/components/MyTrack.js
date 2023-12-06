import * as THREE from 'three';

class MyTrack {
    /**
     * constructs the object
     * @param {THREE.Scene} scene The application scene
     */
    constructor(scene) {
        this.scene = scene;
        this.segments = 100;
        this.width = 10;
        this.textureRepeat = 10;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = true;
        this.closedCurve = false;

        this.path = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-50, 0.1, 50),
            new THREE.Vector3(0, 0.1, 0),
            new THREE.Vector3(50, 0.1, 50)
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
        let geometry = new THREE.TubeGeometry(
        this.path,
        this.segments,
        this.width,
        3,
        this.closedCurve
        );
        this.mesh = new THREE.Mesh(geometry, this.material);
        this.wireframe = new THREE.Mesh(geometry, this.wireframeMaterial);

        let points = this.path.getPoints(this.segments);
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

        this.curve.rotateZ(Math.PI);
        this.curve.scale.set(1,0.2,1);
        this.scene.add(this.curve);
    }
}
export { MyTrack };
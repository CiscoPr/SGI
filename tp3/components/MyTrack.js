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
        this.textureRepeat = 10;
        this.showWireframe = false;
        this.showMesh = true;
        this.showLine = true;
        this.closedCurve = false;

        this.path1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-4000, 0, -3500),
            new THREE.Vector3(-4000, 0, 0),
            new THREE.Vector3(-4000, 0, 4000)
        ]);

        this.path2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-4000, 0, 4000),
            new THREE.Vector3(-4000, 0, 6000),
            new THREE.Vector3(1500, 0, 6000),
        ]);

        this.path3 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(1500, 0, 6000),
            new THREE.Vector3(4000, 0, 6000),
            new THREE.Vector3(4000, 0, 4000),
        ]);

        this.path4 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(4000, 0, 4000),
            new THREE.Vector3(4000, 0, 2000),
            new THREE.Vector3(-1500, 0, 2000),
        ]);

        this.path5 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-1500, 0, 2000),
            new THREE.Vector3(-2000, 0, 2000),
            new THREE.Vector3(-2000, 0, -100),
        ]);

        this.path6 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-2000, 0, -100),
            new THREE.Vector3(-2000, 0, -1000),
            new THREE.Vector3(4000, 0, -1000),
        ]);

        this.path7 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(4000, 0, -1000),
            new THREE.Vector3(5000, 0, -1000),
            new THREE.Vector3(5000, 0, -4000),
        ]);


        this.path8 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(5000, 0, -4000),
            new THREE.Vector3(5000, 0, -5000),
            new THREE.Vector3(-3000, 0, -5000),
        ]);

        this.path9 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-3000, 0, -5000),
            new THREE.Vector3(-4000, 0, -5000),
            new THREE.Vector3(-4000, 0, -3500),
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

        //2nd curve
        let geometry2 = new THREE.TubeGeometry(
        this.path2,
        this.segments,
        this.width,
        3,
        this.closedCurve
        );

        this.mesh2 = new THREE.Mesh(geometry2, this.material);
        this.mesh2.castShadow = true;
        this.mesh2.receiveShadow = true;
        this.wireframe2 = new THREE.Mesh(geometry2, this.wireframeMaterial);

        let points2 = this.path2.getPoints(this.segments);
        let bGeometry2 = new THREE.BufferGeometry().setFromPoints(points2);
        // Create the final object to add to the scene
        this.line2 = new THREE.Line(bGeometry2, this.lineMaterial);

        //3rd curve
        let geometry3 = new THREE.TubeGeometry(
        this.path3,
        this.segments,
        this.width,
        3,
        this.closedCurve
        );

        this.mesh3 = new THREE.Mesh(geometry3, this.material);
        this.mesh3.castShadow = true;
        this.mesh3.receiveShadow = true;
        this.wireframe3 = new THREE.Mesh(geometry3, this.wireframeMaterial);

        let points3 = this.path3.getPoints(this.segments);
        let bGeometry3 = new THREE.BufferGeometry().setFromPoints(points3);
        // Create the final object to add to the scene
        this.line3 = new THREE.Line(bGeometry3, this.lineMaterial);

        //4th curve
        let geometry4 = new THREE.TubeGeometry(
        this.path4,
        this.segments,
        this.width,
        3,
        this.closedCurve
        );

        this.mesh4 = new THREE.Mesh(geometry4, this.material);
        this.mesh4.castShadow = true;
        this.mesh4.receiveShadow = true;
        this.wireframe4 = new THREE.Mesh(geometry4, this.wireframeMaterial);

        let points4 = this.path4.getPoints(this.segments);
        let bGeometry4 = new THREE.BufferGeometry().setFromPoints(points4);
        // Create the final object to add to the scene
        this.line4 = new THREE.Line(bGeometry4, this.lineMaterial);


        //5th curve
        let geometry5 = new THREE.TubeGeometry(
        this.path5,
        this.segments,
        this.width,
        3,
        this.closedCurve
        );

        this.mesh5 = new THREE.Mesh(geometry5, this.material);
        this.mesh5.castShadow = true;
        this.mesh5.receiveShadow = true;
        this.wireframe5 = new THREE.Mesh(geometry5, this.wireframeMaterial);

        let points5 = this.path5.getPoints(this.segments);
        let bGeometry5 = new THREE.BufferGeometry().setFromPoints(points5);
        // Create the final object to add to the scene
        this.line5 = new THREE.Line(bGeometry5, this.lineMaterial);


        //6th curve
        let geometry6 = new THREE.TubeGeometry(
        this.path6,
        this.segments,
        this.width,
        3,
        this.closedCurve
        );

        this.mesh6 = new THREE.Mesh(geometry6, this.material);
        this.mesh6.castShadow = true;
        this.mesh6.receiveShadow = true;
        this.wireframe6 = new THREE.Mesh(geometry6, this.wireframeMaterial);

        let points6 = this.path6.getPoints(this.segments);
        let bGeometry6 = new THREE.BufferGeometry().setFromPoints(points6);
        // Create the final object to add to the scene
        this.line6 = new THREE.Line(bGeometry6, this.lineMaterial);

        //7th curve
        let geometry7 = new THREE.TubeGeometry(
        this.path7,
        this.segments,
        this.width,
        3,
        this.closedCurve
        );

        this.mesh7 = new THREE.Mesh(geometry7, this.material);
        this.mesh7.castShadow = true;
        this.mesh7.receiveShadow = true;
        this.wireframe7 = new THREE.Mesh(geometry7, this.wireframeMaterial);

        let points7 = this.path7.getPoints(this.segments);
        let bGeometry7 = new THREE.BufferGeometry().setFromPoints(points7);
        // Create the final object to add to the scene
        this.line7 = new THREE.Line(bGeometry7, this.lineMaterial);

        //8th curve
        let geometry8 = new THREE.TubeGeometry(
        this.path8,
        this.segments,
        this.width,
        3,
        this.closedCurve
        );

        this.mesh8 = new THREE.Mesh(geometry8, this.material);
        this.mesh8.castShadow = true;
        this.mesh8.receiveShadow = true;
        this.wireframe8 = new THREE.Mesh(geometry8, this.wireframeMaterial);

        let points8 = this.path8.getPoints(this.segments);
        let bGeometry8 = new THREE.BufferGeometry().setFromPoints(points8);
        // Create the final object to add to the scene
        this.line8 = new THREE.Line(bGeometry8, this.lineMaterial);

        //9th curve
        let geometry9 = new THREE.TubeGeometry(
        this.path9,
        this.segments,
        this.width,
        3,
        this.closedCurve
        );

        this.mesh9 = new THREE.Mesh(geometry9, this.material);
        this.mesh9.castShadow = true;
        this.mesh9.receiveShadow = true;
        this.wireframe9 = new THREE.Mesh(geometry9, this.wireframeMaterial);

        let points9 = this.path9.getPoints(this.segments);
        let bGeometry9 = new THREE.BufferGeometry().setFromPoints(points9);
        // Create the final object to add to the scene
        this.line9 = new THREE.Line(bGeometry9, this.lineMaterial);

        this.curve = new THREE.Group();

        this.mesh.visible = this.showMesh;
        this.wireframe.visible = this.showWireframe;
        this.line.visible = this.showLine;
        this.mesh2.visible = this.showMesh;
        this.wireframe2.visible = this.showWireframe;
        this.line2.visible = this.showLine;
        this.mesh3.visible = this.showMesh;
        this.wireframe3.visible = this.showWireframe;
        this.line3.visible = this.showLine;
        this.mesh4.visible = this.showMesh;
        this.wireframe4.visible = this.showWireframe;
        this.line4.visible = this.showLine;
        this.mesh5.visible = this.showMesh;
        this.wireframe5.visible = this.showWireframe;
        this.line5.visible = this.showLine;
        this.mesh6.visible = this.showMesh;
        this.wireframe6.visible = this.showWireframe;
        this.line6.visible = this.showLine;
        this.mesh7.visible = this.showMesh;
        this.wireframe7.visible = this.showWireframe;
        this.line7.visible = this.showLine;
        this.mesh8.visible = this.showMesh;
        this.wireframe8.visible = this.showWireframe;
        this.line8.visible = this.showLine;
        this.mesh9.visible = this.showMesh;
        this.wireframe9.visible = this.showWireframe;
        this.line9.visible = this.showLine;



        this.curve.add(this.mesh);
        this.curve.add(this.wireframe);
        this.curve.add(this.line);
        this.curve.add(this.mesh2);
        this.curve.add(this.wireframe2);
        this.curve.add(this.line2);
        this.curve.add(this.mesh3);
        this.curve.add(this.wireframe3);
        this.curve.add(this.line3);
        this.curve.add(this.mesh4);
        this.curve.add(this.wireframe4);
        this.curve.add(this.line4);
        this.curve.add(this.mesh5);
        this.curve.add(this.wireframe5);
        this.curve.add(this.line5);
        this.curve.add(this.mesh6);
        this.curve.add(this.wireframe6);
        this.curve.add(this.line6);
        this.curve.add(this.mesh7);
        this.curve.add(this.wireframe7);
        this.curve.add(this.line7);
        this.curve.add(this.mesh8);
        this.curve.add(this.wireframe8);
        this.curve.add(this.line8);
        this.curve.add(this.mesh9);
        this.curve.add(this.wireframe9);
        this.curve.add(this.line9);



        this.curve.rotateZ(Math.PI);
        this.curve.scale.set(1, 0.2, 1);
        this.curve.position.set(0, -5.1, 0);
        this.scene.add(this.curve);
    }
}
export { MyTrack };
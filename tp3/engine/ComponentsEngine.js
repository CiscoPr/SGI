import * as THREE from 'three';
import { MyNurbsBuilder } from '../MyNurbsBuilder.js';
import { TriangleEngine } from './TriangleEngine.js';
import { AuxEngine } from './AuxEngine.js';

/**
 *  This class contains the contents of the geometry engine
 */
class ComponentsEngine  {

    /**
       constructs the object
       @param {Array} params paramaters
    */
    constructor(params) {
        this.params = params;
    }

    /**
     * Builds the light
     */
    buildComponent(app ,material, ts, tt) {
        // create switch case for each light type
        switch(this.params.subtype) {
            case "rectangle":
                return this.buildRectangle(app, material,ts, tt);
            case "cylinder":
                return this.buildCylinder(material);
            case "triangle":
                return this.buildTriangle(material);
            case "sphere":
                return this.buildSphere(material);
            case "box":
                return this.buildBox(material);
            case "nurbs":
                return this.buildNurb(material);
            case "skybox":
                return this.buildSkybox(material);
            case "polygon":
                return this.buildPolygon();
            default:
                console.error("Geometry type not found: ", this.params.subtype);
                return;

        }
    }

    buildRectangle(app, material, ts, tt) {
        const width = this.params.representations[0].xy2[0] - this.params.representations[0].xy1[0];
        const height = this.params.representations[0].xy2[1] - this.params.representations[0].xy1[1];
        if(material.bumpMap != null) material.bumpMap.repeat = {x: width/ts, y: height/tt}
        if(material.map != null) material.map.repeat = {x: width/ts, y: height/tt}

        const rectangleGeometry = new THREE.PlaneGeometry(width , height,
            this.params.representations[0].parts_x, this.params.representations[0].parts_y);

            let rectangleMesh;

            if (material == null) rectangleMesh = new THREE.Mesh(rectangleGeometry);
            else rectangleMesh = new THREE.Mesh(rectangleGeometry, material);

        // get the cast and receive shadow flags
        const castShadowFlag = this.params.castShadows;
        const receiveShadowFlag = this.params.receiveShadows;
        rectangleMesh.castShadow = castShadowFlag;
        rectangleMesh.receiveShadow = receiveShadowFlag;

        rectangleMesh.position.set(this.params.representations[0].xy1[0], this.params.representations[0].xy1[1], 0);
        rectangleMesh.position.x += width / 2;
        rectangleMesh.position.y += height / 2;

        app.scene.add(rectangleMesh);

        const rectangle = new THREE.LOD();
        rectangle.addLevel(rectangleMesh, this.params.representations[0].distance);

        return rectangle;
    }

    buildCylinder(material) {
        if(this.params.representations[0].capsclose == false)
            this.params.representations[0].capsclose = true;
        else
            this.params.representations[0].capsclose = false;
        const cylinderGeometry = new THREE.CylinderGeometry(this.params.representations[0].top, this.params.representations[0].base,
            this.params.representations[0].height, this.params.representations[0].slices, this.params.representations[0].stacks,
            this.params.representations[0].capsclose, this.params.representations[0].thetastart, this.params.representations[0].thetalength);

        let cylinderMesh;

        if (material == null) cylinderMesh = new THREE.Mesh(cylinderGeometry);
        else cylinderMesh = new THREE.Mesh(cylinderGeometry, material);

        const castShadowFlag = this.params.castShadows;
        const receiveShadowFlag = this.params.receiveShadows;
        cylinderMesh.castShadow = castShadowFlag;
        cylinderMesh.receiveShadow = receiveShadowFlag;

        const cylinder = new THREE.LOD();
        cylinder.addLevel(cylinderMesh, this.params.representations[0].distance);

        return cylinder;
    }

    buildTriangle(material) {

        const triangleGeometry = new TriangleEngine(
            this.params.representations[0].xyz1,
            this.params.representations[0].xyz2,
            this.params.representations[0].xyz3);

        let triangleMesh;

        if (material == null) triangleMesh = new THREE.Mesh(triangleGeometry);
        else triangleMesh = new THREE.Mesh(triangleGeometry, material);


        const castShadowFlag = this.params.castShadows;
        const receiveShadowFlag = this.params.receiveShadows;
        triangleMesh.castShadow = castShadowFlag;
        triangleMesh.receiveShadow = receiveShadowFlag;

        const triangle = new THREE.LOD();

        triangle.addLevel(triangleMesh, this.params.representations[0].distance);

        return triangle;
    }

    buildSphere(material) {
        const radius = this.params.representations[0].radius;
        const slices = this.params.representations[0].slices;
        const stacks = this.params.representations[0].stacks;
        const thetaStart = this.params.representations[0].thetastart;
        const thetaLength = this.params.representations[0].thetalength;
        const phiStart = this.params.representations[0].phistart;
        const phiLength = this.params.representations[0].philength;

        const sphereGeometry = new THREE.SphereGeometry(radius, slices, stacks,  phiStart, phiLength, thetaStart, thetaLength);

        let sphereMesh;

        if (material == null) sphereMesh = new THREE.Mesh(sphereGeometry);
        else sphereMesh = new THREE.Mesh(sphereGeometry, material);

        const castShadowFlag = this.params.castShadows;
        const receiveShadowFlag = this.params.receiveShadows;
        sphereMesh.castShadow = castShadowFlag;
        sphereMesh.receiveShadow = receiveShadowFlag;

        const sphere = new THREE.LOD();
        sphere.addLevel(sphereMesh, this.params.representations[0].distance);

        return sphere;
    }

    buildBox(material) {
        const width = this.params.representations[0].xyz2[0] - this.params.representations[0].xyz1[0];
        const height = this.params.representations[0].xyz2[1] - this.params.representations[0].xyz1[1];
        const depth = this.params.representations[0].xyz2[2] - this.params.representations[0].xyz1[2];
        const boxGeometry = new THREE.BoxGeometry(width, height, depth,
            this.params.representations[0].parts_x, this.params.representations[0].parts_y, this.params.representations[0].parts_z);

        let boxMesh;
        material.transparent = true;
        if (material == null) boxMesh = new THREE.Mesh(boxGeometry, new THREE.MeshBasicMaterial({ color: 0x00ff00 }));
        else boxMesh = new THREE.Mesh(boxGeometry, material);

        const castShadowFlag = this.params.castShadows;
        const receiveShadowFlag = this.params.receiveShadows;
        boxMesh.castShadow = castShadowFlag;
        boxMesh.receiveShadow = receiveShadowFlag;

        boxMesh.position.set(width / 2, height / 2, depth / 2);

        const box = new THREE.LOD();
        box.addLevel(boxMesh, this.params.representations[0].distance);

        return box;
    }

    buildNurb(material) {
        const controlPoints = [];
        const degree_u = this.params.representations[0].degree_u;
        const degree_v = this.params.representations[0].degree_v;
        const copy = this.params.representations[0].controlpoints.slice();
        console.log("params:", this.params.representations[0].controlpoints);
        for (let i = 0; i < degree_u+1; i++) {
            controlPoints.push([]);
            for (let j = 0; j < degree_v+1; j++) {
                controlPoints[i].push(this.params.representations[0].controlpoints[0]);
                this.params.representations[0].controlpoints.shift();
            }
        }
        this.params.representations[0].controlpoints = copy;

        console.info(controlPoints);

        const builder = new MyNurbsBuilder();
        let surfaceData = builder.build(controlPoints, degree_u, degree_v,
            this.params.representations[0].parts_u, this.params.representations[0].parts_v, material);
        let nurbsMesh;
        if (material == null) nurbsMesh = new THREE.Mesh(surfaceData);
        else nurbsMesh = new THREE.Mesh(surfaceData, material);

        const castShadowFlag = this.params.castShadows;
        const receiveShadowFlag = this.params.receiveShadows;
        nurbsMesh.castShadow = castShadowFlag;
        nurbsMesh.receiveShadow = receiveShadowFlag;

        return nurbsMesh;
    }

    buildPolygon() {
        // create auxiliary tool
        const auxEngine = new AuxEngine();

        // create group
        const group = new THREE.Group();

        const radius = this.params.representations[0].radius;
        const slices = this.params.representations[0].slices;
        const stacks = this.params.representations[0].stacks;
        const angle = Math.PI * 2 / slices;
        const step = radius / stacks;
        const color_p = this.params.representations[0].color_p;
        const color_c = this.params.representations[0].color_c;

        // create cycle for each slice
        for (let i = 0; i < slices; i++) {
            // create group for each slice
            const sliceGroup = new THREE.Group();
            // create cycle for each stack
            for (let j = 1; j <= stacks; j++) {
                if (j == 1) {
                    // create triangle
                    let p1x = 0; const p1y = 0; const p1z = 0;
                    let p2x = step * j * Math.cos(angle * i); let p2y = step * j * Math.sin(angle * i); let p2z = 0;
                    let p3x = step * j * Math.cos(angle * (i + 1)); let p3y = step * j * Math.sin(angle * (i + 1)); let p3z = 0;
                    let vertexColors = auxEngine.calVertexColor(p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z, radius, color_p, color_c);
                    let triangleSurface = new TriangleEngine(p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z, vertexColors);
                    let triangleMesh = new THREE.Mesh(triangleSurface, new THREE.MeshPhongMaterial( {
                        side: THREE.DoubleSide,
                        vertexColors: true,
                        transparent:true
                    } ));
                    sliceGroup.add(triangleMesh);
                    continue;
                }

                // create first triangle
                let p1x = step * (j - 1) * Math.cos(angle * i); let p1y = step  * (j - 1) * Math.sin(angle * i); let p1z = 0;
                let p2x = step * j * Math.cos(angle * i); let p2y = step  * j * Math.sin(angle * i); let p2z = 0;
                let p3x = step * (j - 1) * Math.cos(angle * (i + 1)); let p3y = step * (j - 1) * Math.sin(angle * (i + 1)); let p3z = 0;
                let vertexColors = auxEngine.calVertexColor(p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z, radius, color_p, color_c);
                let triangleSurface = new TriangleEngine(p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z, vertexColors);
                let triangleMesh = new THREE.Mesh(triangleSurface, new THREE.MeshPhongMaterial( {
					side: THREE.DoubleSide,
					vertexColors: true,
                    transparent:true
				} ));
                sliceGroup.add(triangleMesh);

                // create second triangle
                p1x = step * (j - 1) * Math.cos(angle * (i + 1)); p1y = step * (j - 1) * Math.sin(angle * (i + 1)); p1z = 0;
                p2x = step * j * Math.cos(angle * i); p2y = step  * j * Math.sin(angle * i); p2z = 0;
                p3x = step * j * Math.cos(angle * (i + 1)); p3y = step * j * Math.sin(angle * (i + 1)); p3z = 0;
                vertexColors = auxEngine.calVertexColor(p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z, radius, color_p, color_c);
                triangleSurface = new TriangleEngine(p1x, p1y, p1z, p2x, p2y, p2z, p3x, p3y, p3z, vertexColors);
                triangleMesh = new THREE.Mesh(triangleSurface, new THREE.MeshPhongMaterial( {
					side: THREE.DoubleSide,
					vertexColors: true,
                    transparent:true
				} ));
                sliceGroup.add(triangleMesh);

            }
            group.add(sliceGroup);
        }

        return group;
    }

}

export { ComponentsEngine };
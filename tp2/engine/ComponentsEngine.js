import * as THREE from 'three';
import { MyNurbsBuilder } from '../MyNurbsBuilder.js';
import { TriangleEngine } from './TriangleEngine.js';

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
    buildComponent(material, ts, tt) {
        console.log(this.params);

        // create switch case for each light type
        switch(this.params.subtype) {
            case "rectangle":
                return this.buildRectangle(material,ts, tt);
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
            default:
                console.error("Geometry type not found");
                return;

        }
    }

    buildRectangle(material, ts, tt) {
        const width = this.params.representations[0].xy2[0] - this.params.representations[0].xy1[0];
        const height = this.params.representations[0].xy2[1] - this.params.representations[0].xy1[1];
        if(material.bumpMap != null) material.bumpMap.repeat = {x: width/ts, y: height/tt}
        if(material.map != null) material.map.repeat = {x: width/ts, y: height/tt}

        const rectangleGeometry = new THREE.PlaneGeometry(width , height,
            this.params.representations[0].parts_x, this.params.representations[0].parts_y);

        let rectangleMesh;

        if (material == null) rectangleMesh = new THREE.Mesh(rectangleGeometry);
        else rectangleMesh = new THREE.Mesh(rectangleGeometry, material);

        rectangleMesh.position.set(this.params.representations[0].xy1[0], this.params.representations[0].xy1[1], 0);
        rectangleMesh.position.x += width / 2;
        rectangleMesh.position.y += height / 2;

        const rectangle = new THREE.LOD();
        rectangle.addLevel(rectangleMesh, this.params.representations[0].distance);

        return rectangle;
    }

    buildCylinder(material) {
        const cylinderGeometry = new THREE.CylinderGeometry(this.params.representations[0].top, this.params.representations[0].base,
            this.params.representations[0].height, this.params.representations[0].slices, this.params.representations[0].stacks,
            this.params.representations[0].capsclose, this.params.representations[0].thetastart, this.params.representations[0].thetalength);

        let cylinderMesh;

        if (material == null) cylinderMesh = new THREE.Mesh(cylinderGeometry);
        else cylinderMesh = new THREE.Mesh(cylinderGeometry, material);

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

        boxMesh.position.set(width / 2, height / 2, depth / 2);

        const box = new THREE.LOD();
        box.addLevel(boxMesh, this.params.representations[0].distance);

        return box;
    }

    buildNurb(material) {
        const controlPoints = [];
        const degree_u = this.params.representations[0].degree_u;
        const degree_v = this.params.representations[0].degree_v;

        for (let i = 0; i < this.params.representations[0].controlpoints.length; i += degree_u * 2) {
            const rows= this.params.representations[0].controlpoints.slice(i, degree_u * 2);
            console.info(rows);
            console.info(rows.length);
            for (let j = 0; j < rows.length; j++) {
                const controlPoint = [];
                controlPoint.push(rows[j].xx);
                controlPoint.push(rows[j].yy);
                controlPoint.push(rows[j].zz);
                controlPoints.push(controlPoint);
            }
        }

        console.info(controlPoints);

        const builder = new MyNurbsBuilder();
        let surfaceData = builder.build(controlPoints, degree_u, degree_v,
            this.params.representations[0].parts_u, this.params.representations[0].parts_v, material);

        if (material == null) return new THREE.Mesh(surfaceData);
        else return new THREE.Mesh(surfaceData, material);
    }

    buildSkybox(material) {
        return null;
    }

}

export { ComponentsEngine };
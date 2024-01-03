import * as THREE from 'three';

/**
 *  This class contains the contents of out lights engine
 */
class LightsEngine  {

    /**
       constructs the object
       @param {Array} light paramaters
    */
    constructor(params, app) {
        this.params = params;
        this.app = app;
    }

    /**
     * Builds the light
     */
    buildLight() {
        console.log(this.params);
        // create switch case for each light type
        switch(this.params.type) {
            case "pointlight":
                return this.buildPointLight();
            case "directionallight":
                return this.buildDirectionalLight();
            case "spotlight":
                return this.buildSpotLight();
            default:
                console.error("Light type not found");
                return;

        }
    }

    buildDirectionalLight() {
        const light = new THREE.DirectionalLight(this.params.color.getHex(), this.params.intensity);
        light.position.set(this.params.position[0], this.params.position[1], this.params.position[2]);
        light.castShadow = this.params.castshadow;

        if (light.castShadow) {
            light.shadow.mapSize.width = this.params.shadowmapsize;
            light.shadow.mapSize.height = this.params.shadowmapsize;
            light.shadow.camera.far = this.params.shadowfar;
            light.shadow.camera.left = this.params.shadowleft;
            light.shadow.camera.right = this.params.shadowright;
            light.shadow.camera.top = this.params.shadowtop;
            light.shadow.camera.bottom = this.params.shadowbottom;
        }

        // create helper
        const helper = new THREE.DirectionalLightHelper(light);
        //this.app.scene.add(helper);

        return light;
    }

    buildPointLight() {
        const light = new THREE.PointLight(this.params.color.getHex(), this.params.intensity, this.params.distance, this.params.decay);
        light.position.set(this.params.position[0], this.params.position[1], this.params.position[2]);
        light.castShadow = this.params.castshadow;

        if (light.castShadow) {
            light.shadow.mapSize.width = this.params.shadowmapsize;
            light.shadow.mapSize.height = this.params.shadowmapsize;
            light.shadow.camera.far = this.params.shadowfar;
        }

        // create helper
        const helper = new THREE.PointLightHelper(light);
        //this.app.scene.add(helper);

        return light;
    }

    buildSpotLight() {
        const light = new THREE.SpotLight(this.params.color.getHex(), this.params.intensity, this.params.distance, this.params.angle, this.params.penumbra, this.params.decay);
        light.position.set(this.params.position[0], this.params.position[1], this.params.position[2]);
        light.castShadow = this.params.castshadow;
        console.log("my cast shadow, " , light.shadow)
        if (light.castShadow) {
            light.shadow.mapSize.width = this.params.shadowmapsize;
            light.shadow.mapSize.height = this.params.shadowmapsize;
            light.shadow.camera.far = this.params.shadowfar;
        }

        // create target
        const target = new THREE.Object3D();
        target.position.set(this.params.target[0], this.params.target[1], this.params.target[2]);
        light.target = target;
        this.app.scene.add(target);

        // create helper
        const helper = new THREE.SpotLightHelper(light);
        //this.app.scene.add(helper);

        // add target to light



        return light;
    }
}

export { LightsEngine };
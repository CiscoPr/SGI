import * as THREE from 'three';

/**
 *  This class contains the contents of out lights engine
 */
class LightsEngine  {

    /**
       constructs the object
       @param {Array} light paramaters
    */ 
    constructor(params) {
        this.params = params;
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
        
    }

    buildPointLight() {
        
    }

    buildSpotLight() {
        
    }
}

export { LightsEngine };
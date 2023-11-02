import * as THREE from 'three';

/**
 * This class contains the contents of out cameras engine
 *
 */

class CamerasEngine {

        /**
        constructs the object
        @param {Array} cameras paramaters
        */
        constructor(params) {
            this.params = params;
        }

        /**
         * Builds the camera
         */
        buildCamera() {
            console.log(this.params);
            // create switch case for each camera type
            switch (this.params.type) {
                case "perspective":
                    return this.buildPerspectiveCamera();
                case "orthogonal":
                    return this.buildOrthoCamera();
                default:
                    console.error("Camera type not found");
                    return;

            }
        }

        buildPerspectiveCamera() {
            const camera = new THREE.PerspectiveCamera(this.params.angle, this.params.near, this.params.far);
            camera.position.set(this.params.position[0], this.params.position[1], this.params.position[2]);
            camera.lookAt(this.params.target[0], this.params.target[1], this.params.target[2]);
            return camera;
        }

        buildOrthoCamera() {
            const camera = new THREE.OrthographicCamera(this.params.left, this.params.right, this.params.top, this.params.bottom, this.params.near, this.params.far);
            camera.position.set(this.params.position[0], this.params.position[1], this.params.position[2]);
            camera.lookAt(this.params.target[0], this.params.target[1], this.params.target[2]);
            return camera;
        }

}

export { CamerasEngine };
import * as THREE from 'three';

/**
 * This class contains camera auxiliary methods used in the main engine
 */
class CamerasEngine{

    /**
     * Constructs the object
     */
    constructor(app) {
        this.app = app;
    }

    /**
     * Creates the orthographic cameras
     * @param {Array} cameras
     * @param {Object} cam
     * @param {Float} aspect
     */
    dealWithOrthogonal(cameras,cam, aspect) {
        const left = - cameras[cam].left / 2 * aspect
        const right = cameras[cam].right /2 * aspect
        const top = cameras[cam].top / 2
        const bottom = -cameras[cam].bottom / 2
        const near = -cameras[cam].near /2
        const far =  cameras[cam].far
        const cameraLeft = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        const cameraRight = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        const cameraTop = new THREE.OrthographicCamera(left, right, top, bottom, near, far);
        const cameraBottom = new THREE.OrthographicCamera(left, right, top, bottom, near, far);

        cameraLeft.up = new THREE.Vector3(0,1,0);
        cameraLeft.position.set(-cameras[cam].location[0] /4,0,0);
        cameraLeft.lookAt( cameras[cam].target);
        this.app.cameras['Left'] = cameraLeft;

        cameraRight.up = new THREE.Vector3(0,1,0);
        cameraRight.position.set(cameras[cam].location[0] /4,0,0);
        cameraRight.lookAt( cameras[cam].target );
        this.app.cameras['Right'] = cameraRight;

        cameraTop.up = new THREE.Vector3(0,0,1);
        cameraTop.position.set(0, cameras[cam].location[1] /4, 0);
        cameraTop.lookAt(cameras[cam].target);
        this.app.cameras['Top'] = cameraTop;

        cameraBottom.up = new THREE.Vector3(0,0,1);
        cameraBottom.position.set(0, -cameras[cam].location[1] /4, 0);
        cameraBottom.lookAt( cameras[cam].target );
        this.app.cameras['Bottom'] = cameraBottom;
    }


    /**
     * Creates the perspective camera
     * @param {Array} cameras
     * @param {Object} cam
     */
    dealWithPerspective(cameras, cam){
        const camera = new THREE.PerspectiveCamera(cameras[cam].fov, cameras[cam].an,cameras[cam].near, cameras[cam].far);
        camera.position.set(cameras[cam].location[0], cameras[cam].location[1], cameras[cam].location[2]);
        camera.lookAt(cameras[cam].target[0], cameras[cam].target[1], cameras[cam].target[2]);
        this.app.cameras['Perspective'] = camera;
    }


}
export {CamerasEngine};
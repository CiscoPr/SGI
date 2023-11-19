import { GUI } from 'three/addons/libs/lil-gui.module.min.js';
import { MyApp } from './MyApp.js';
import { MyContents } from './MyContents.js';

/**
    This class customizes the gui interface for the app
*/
class MyGuiInterface  {

    /**
     *
     * @param {MyApp} app The application object
     */
    constructor(app) {
        this.app = app
        this.datgui =  new GUI();
        this.contents = null
    }

    /**
     * Set the contents object
     * @param {MyContents} contents the contents objects
     */
    setContents(contents) {
        this.contents = contents
    }

    /**
     * Initialize the gui interface
     */
    init() {
        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        const cameraNames = ["Perspective", "Right", "Left", "Top", "Bottom"]
        console.log("my cameras", this.app.cameras);
        //only get the cam1 and cam2
        console.log("cameraNames", cameraNames);

        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Left', 'Top', 'Bottom', "Right"] ).name("active camera");
        /*
        for(let m in this.app.cameras) {
            console.log("m: "+ JSON.stringify(m))
            cameraNames.push(m)
        }
        */

        cameraFolder.open()
    }
}

export { MyGuiInterface };
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
        cameraFolder.add(this.app, 'activeCameraName', cameraNames ).name("active camera");
        cameraFolder.open()

        var text ={
            showBumpTexture: 'on',
        }

        /*
        const bumpFolder = this.datgui.addFolder('Bump')
        bumpFolder.add(text, 'showBumpTexture', { On: 'on', Off: 'off' }).name("Show Bump").onChange((value) => {
            this.contents.engine.updateShowBumpTexture(value === 'on');
        });
        */
    }
}

export { MyGuiInterface };
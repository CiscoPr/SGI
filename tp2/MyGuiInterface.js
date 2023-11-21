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


        console.log("my data", this.contents.engine.data.skyboxes)
        var data = {
            turnSkyboxOn :'on'
        }

        const skyboxFolder = this.datgui.addFolder('Skybox')
        skyboxFolder.add(data, 'turnSkyboxOn', {On:'on', Off: 'off'}).name("Show skybox").onChange((value) => {
            this.contents.engine.updateSkybox(value);
        });
        skyboxFolder.open()

        var text = {
            turnOnLights: 'on',
        }
        const lightsFolder = this.datgui.addFolder('Lights')
        lightsFolder.add(text, 'turnOnLights', { On: 'on', Off: 'off' }).name("Turn on lights").onChange((value) => {
            this.contents.engine.updateLights(value);
        });
    }
}

export { MyGuiInterface };
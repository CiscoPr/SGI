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
        // add a folder to the gui interface for the box
        //const boxFolder = this.datgui.addFolder( 'Box' );
        // note that we are using a property from the contents object
        /* boxFolder.add(this.contents, 'boxMeshSize', 0, 10).name("size").onChange( () => { this.contents.rebuildBox() } );
        boxFolder.add(this.contents, 'boxEnabled', true).name("enabled");
        boxFolder.add(this.contents.boxDisplacement, 'x', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'y', -5, 5)
        boxFolder.add(this.contents.boxDisplacement, 'z', -5, 5)
        boxFolder.open() */



        const data = {
            'cakeColor': this.contents.cake.cakeMesh2.material.color,
            'petalColor': this.contents.flower.petalColor,
            'wallColor': this.contents.walls.diffuse,
        };

        //adds a folder to the gui interface for the colors
        const colorsFolder = this.datgui.addFolder('Color Change');
        colorsFolder.addColor(data, 'cakeColor').onChange((value) => { this.contents.updateCakeTopping(value) });
        colorsFolder.addColor(data, 'petalColor').onChange((value) => { this.contents.updateFlowerPetalColor(value) });
        colorsFolder.addColor(data, 'wallColor').onChange((value) => { this.contents.updateWallColor(value) });
        colorsFolder.open();

        // adds a folder to the gui interface to control display of the figures
        const displayFolder = this.datgui.addFolder('Display');
        displayFolder.add(this.contents.candle, 'candleEnabled', true).name("candle enabled");
        displayFolder.add(this.contents.window, 'windowEnabled', true).name("window enabled");
        displayFolder.open();

        // adds a folder to the gui interface for the plane
        /*const planeFolder = this.datgui.addFolder( 'Plane' );
        planeFolder.addColor( data, 'diffuse color' ).onChange( (value) => { this.contents.updateDiffusePlaneColor(value) } );
        planeFolder.addColor( data, 'specular color' ).onChange( (value) => { this.contents.updateSpecularPlaneColor(value) } );
        planeFolder.add(this.contents, 'planeShininess', 0, 1000).name("shininess").onChange( (value) => { this.contents.updatePlaneShininess(value) } );
        planeFolder.open();*/

        // adds a folder to the gui interface for the camera
        const cameraFolder = this.datgui.addFolder('Camera')
        cameraFolder.add(this.app, 'activeCameraName', [ 'Perspective', 'Perspective2', 'Left', 'Top', 'Front', 'Back', "Right"] ).name("active camera");
        // note that we are using a property from the app
        cameraFolder.add(this.app.activeCamera.position, 'x', 0, 10).name("x coord")
        cameraFolder.open()

        // adds a folder to the gui interface for the plane texture
        /*const textureFolder = this.datgui.addFolder('Texture');
        textureFolder.add(this.contents.planeTexture, 'wrapS', [ 'RepeatWrapping', 'ClampToEdgeWrapping', 'MirroredRepeatWrapping' ] ).name('wrapS').onChange((value) => { this.contents.updatePlaneTexture(value) });

        textureFolder.open()*/
    }
}

export { MyGuiInterface };

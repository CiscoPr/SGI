import * as THREE from 'three';
import { MyAxis } from './MyAxis.js';
import { MyEngine } from './engine/MyEngine.js';
import { MyFileReader } from './parser/MyFileReader.js';
import {MyTrack} from './components/MyTrack.js';
import { CarController } from './controller/CarController.js';
import { MyCar } from './components/MyCar.js';

/**
 *  This class contains the contents of out application
 */
class MyContents {
	/**
			 constructs the object
			 @param {MyApp} app The application object
		*/
	constructor(app) {
		this.app = app;
		this.axis = null;
		this.reader = new MyFileReader(app, this, this.onSceneLoaded);
		this.reader.open("scene/scene.xml")
		this.engine = new MyEngine(app, this);
		this.engine.init();

		// components
		this.track = null;
		this.carModel = null;

		// controllers
		this.carController = null;
	}

	/**
	 * initializes the contents
	 */
	init() {
		// create once

		if (this.axis === null) {
			// create and attach the axis to the scene
			this.axis = new MyAxis(this);
			this.app.scene.add(this.axis);
		}

		//-------------------------------------------------------------------------------


		// add an ambient light
		const ambientLight = new THREE.AmbientLight(0x555555);
		this.app.scene.add(ambientLight);

		//--------------------------------------------------------------------------------

		// build and place models
		this.carModel = new MyCar()
		this.carModel.car.position.set(4100, 25, 0);

		// build controllers
		this.carController = new CarController(this.carModel);

		//build components
		this.track = new MyTrack(this.app.scene);
	
		this.app.scene.add(this.carModel.car)
	}



		readerError() {
			const hasError = this.reader.errorMessage != null ? true : false;
			return hasError;
		}

		/**
		 * Called when the scene xml file load is complete
		 * @param {MySceneData} data the entire scene data object
		 */
		onSceneLoaded(data) {
				console.info("scene data loaded " + data + ". visit MySceneData javascript class to check contents for each data item.");
				this.onAfterSceneLoadedAndBeforeRender(data);
		}

		output(obj, indent = 0) {
				console.log("" + new Array(indent * 4).join(' ') + " - " + obj.type + " " + (obj.id !== undefined ? "'" + obj.id + "'" : ""));
		}

		onAfterSceneLoadedAndBeforeRender(data) {

				// refer to descriptors in class MySceneData.js
				// to see the data structure for each item

				this.output(data.options)
				console.log("textures:")
				for (var key in data.textures) {
						let texture = data.textures[key]
						this.output(texture, 1)
				}

				console.log("materials:")
				for (var key in data.materials) {
						let material = data.materials[key]
						this.output(material, 1)
				}

				console.log("cameras:")
				for (var key in data.cameras) {
						let camera = data.cameras[key]
						this.output(camera, 1)
				}

				console.log("nodes:")
				for (var key in data.nodes) {
						let node = data.nodes[key]
						this.output(node, 1)
						for (let i=0; i< node.children.length; i++) {
								let child = node.children[i]
								if (child.type === "primitive") {
										console.log("" + new Array(2 * 4).join(' ') + " - " + child.type + " with "  + child.representations.length + " " + child.subtype + " representation(s)")
										if (child.subtype === "nurbs") {
												console.log("" + new Array(3 * 4).join(' ') + " - " + child.representations[0].controlpoints.length + " control points")
										}
								}
								else {
										this.output(child, 2)
								}
						}
				}
		}




		update() {
			if (this.carController != null) this.carController.update();
		}
	}

export { MyContents };


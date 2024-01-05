import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { MyShader } from '../components/MyShader.js';
class ScenarioModelsController {
    constructor(scene) {
        this.scene = scene;
      this.shaderMesh = null;
        this.build();
    }

  build() {
      /*
        const loader = new GLTFLoader().setPath('models/');

        loader.load('buildings.glb', async (gltf) => {
            const model = gltf.scene;
            model.traverse(function (object){
              if (object.isMesh) object.castShadow = true;
            });


            model.rotation.y = -Math.PI/2;
            model.position.set(6000, 340, -4500);
            model.scale.set(1500.0, 1500.0, 1500.0);
            this.scene.add(model);
            const model2 = gltf.scene.clone();
            model2.traverse(function (object){
              if (object.isMesh) object.castShadow = true;
            });
            model2.rotation.y = -Math.PI/2;
            model2.position.set(-6000, 340, -4500);
            model2.scale.set(1500.0, 1500.0, 1500.0);
            this.scene.add(model2);

          });

          loader.load('buildings2.glb', async (gltf) => {

            const model = gltf.scene;
            model.traverse(function (object){
              if (object.isMesh) object.castShadow = true;
            });
            model.position.set(-14000, 1360, -25000);
            model.scale.set(-70000.0, 70000.0, 70000.0);
            this.scene.add(model);
            const model2 = gltf.scene.clone();
            model2.traverse(function (object){
              if (object.isMesh) object.castShadow = true;
            });
            model2.position.set(14000, 1390, 25500);
            model2.scale.set(71000.0, 71000.0, -71000.0);
            this.scene.add(model2);

          });
          */
    const planeGeometry = new THREE.PlaneGeometry(20, 15, 60, 120);
    const planeMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff, side: THREE.DoubleSide });
    const texture = new THREE.TextureLoader().load('scene/textures/elements/terrain.png');
    const displaceMap = new THREE.TextureLoader().load('scene/textures/elements/terrain_displace.png');
    const bumpScale = -0.5;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(120, 120);
    planeMaterial.map = texture;
    this.shadermesh = new MyShader(this.app, "shader", "no description provided", "shaders/buildings1.vert", "shaders/buildings1.frag", {
					uSampler1: { type: 'sampler2D', value: displaceMap },
          uSampler2: { type: 'sampler2D', value: texture },
          bumpScale: { type: 'float', value: bumpScale },
				});

    
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    setTimeout(() => {
      plane.material = this.shadermesh.material;
      plane.material.needsUpdate = true;
      plane.position.set(0, 10, 0);
      plane.rotation.x = -Math.PI / 2;
      plane.scale.set(1500, 1500, 1500);
      this.scene.add(plane);

    }, 3000);
    }
} export { ScenarioModelsController };
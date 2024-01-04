import * as THREE from 'three';
import { MyText } from './MyText.js';

class MyHUD {
    constructor(player, lapController) {
        // attributes
        this.width = screen.availWidth / 100;
        this.height = screen.availHeight / 100;
        this.offsetX = this.width / 7;
        this.offsetY = this.height / 14;
        if (this.width < this.height) {
            offsetX = this.width / 14;
            offsetY = this.height / 7;
        } 
        
        // components
        this.hud = null;
        this.gArrow = null;
        this.rArrow = null;
        this.yArrow = null;

        // create hash table
        this.hudElements = new Map();
        
        // controllers
        this.player = player;
        this.lapController = lapController;
    }

    init(scene) {
        this.hud = new THREE.Group();
        
        // speedometer
        let speedSMG = new THREE.Group();
        speedSMG.name = "number";
        speedSMG.position.set(-this.width / 2 + this.offsetX, -this.height / 2 + this.offsetY, 0);
        let speedHandler = new MyText(20);
        speedHandler.init(speedSMG);
        this.hudElements.set(speedSMG, speedHandler);

        // timer
        let timerSMG = new THREE.Group();
        timerSMG.name = "timer";
        timerSMG.position.set(this.width / 2 - this.offsetX * 2, -this.height / 2 + this.offsetY, 0);
        let timerHandler = new MyText(20);
        timerHandler.init(timerSMG);
        this.hudElements.set(timerSMG, timerHandler);

        // lap
        let lapSMG = new THREE.Group();
        lapSMG.name = "lap";
        lapSMG.position.set(-this.width / 2 + this.offsetX, this.height / 2 - this.offsetY, 0);
        let lapHandler = new MyText(20);
        lapHandler.init(lapSMG);
        this.hudElements.set(lapSMG, lapHandler);

        // add effect timer
        let effectSMG = new THREE.Group();
        effectSMG.name = "effect";
        effectSMG.position.set(this.width / 2 - this.offsetX * 2, this.height / 2 - this.offsetY, 0);
        let effectHandler = new MyText(20);
        effectHandler.init(effectSMG);
        this.hudElements.set(effectSMG, effectHandler);

        // add end game text
        let endSMG = new THREE.Group();
        endSMG.name = "end";
        endSMG.position.set(-3.0, 0, 0);
        let endHandler = new MyText(10);
        endHandler.init(endSMG);
        this.hudElements.set(endSMG, endHandler);

        // add pause text
        let pauseSMG = new THREE.Group();
        pauseSMG.name = "pause";
        pauseSMG.position.set(-2, -2, 0);
        let pauseHandler = new MyText(10);
        pauseHandler.init(pauseSMG);
        this.hudElements.set(pauseSMG, pauseHandler);

        // load arrow textures
        let tex_green = new THREE.TextureLoader().load('scene/textures/elements/arrow_green.png');
        let tex_red = new THREE.TextureLoader().load('scene/textures/elements/arrow_red.png');
        let tex_yellow = new THREE.TextureLoader().load('scene/textures/elements/arrow_yellow.png');

        // create arrow materials
        let material_green = new THREE.MeshBasicMaterial({map: tex_green, transparent: true});
        let material_red = new THREE.MeshBasicMaterial({map: tex_red, transparent: true});
        let material_yellow = new THREE.MeshBasicMaterial({map: tex_yellow, transparent: true});
        
        // create and configure arrow meshes
        let geometry = new THREE.PlaneGeometry(1, 1);
        this.gArrow = new THREE.Mesh(geometry, material_green);
        this.rArrow = new THREE.Mesh(geometry, material_red);
        this.yArrow = new THREE.Mesh(geometry, material_yellow);
        this.gArrow.position.set(-this.width / 2 + this.offsetX - 1, -this.height / 2 + this.offsetY, 0);
        this.gArrow.rotation.z = -Math.PI / 2;
        this.rArrow.position.set(-this.width / 2 + this.offsetX - 1, -this.height / 2 + this.offsetY, 0);
        this.rArrow.rotation.z = Math.PI / 2;
        this.yArrow.position.set(-this.width / 2 + this.offsetX - 1, -this.height / 2 + this.offsetY, 0); 
        this.yArrow.rotation.z = Math.PI / 2;
        this.removeArrows();

        // add SMG to hud and add hud to scene
        this.hud.add(speedSMG);
        this.hud.add(timerSMG);
        this.hud.add(lapSMG);
        this.hud.add(effectSMG);
        this.hud.add(endSMG);
        this.hud.add(pauseSMG);
        this.hud.add(this.gArrow);
        this.hud.add(this.rArrow);
        this.hud.add(this.yArrow);
        scene.add(this.hud);
    }

    convertTime(time) {
        // time is in miliseconds, convert to minutes and seconds
        let minutes = Math.floor(time / 60000);
        let seconds = Math.floor((time - minutes * 60000) / 1000);

        return minutes + ":" + seconds;
    }

    convertEffect(effect) {
        // effect is in miliseconds, convert to seconds
        let seconds = Math.ceil(effect / 1000);
        return seconds;
    }

    removeArrows() {
        this.gArrow.visible = false;
        this.rArrow.visible = false;
        this.yArrow.visible = false;
    }

    showArrow(color) {
        this.removeArrows();
        if (color == "green") this.gArrow.visible = true;
        else if (color == "red") this.rArrow.visible = true;
        else if (color == "yellow") this.yArrow.visible = true;
    }

    update(camera, pause) {
        if (camera != null){
            // get camera position and camare direction
            let cameraPos = camera.position;
            let cameraDir = camera.getWorldDirection(new THREE.Vector3());
    
            // place plane in front of the camera
            let planePos = cameraPos.clone();
            let scale = this.width > this.height ? this.width / 2.8 : this.height / 2.8;
            planePos.add(cameraDir.multiplyScalar(scale));
            this.hud.position.set(planePos.x, planePos.y, planePos.z);
            this.hud.lookAt(cameraPos);
        }

        let keys = this.hudElements.keys();
        for (let key of keys) if (key == null) return;
        
        if (this.hudElements.size == 6) {
            // get speedometer from hud
            let speedSMG = this.hud.getObjectByName("number");
            let speedHandler = this.hudElements.get(speedSMG);
            speedHandler.load(speedSMG, Math.floor(this.player.realSpeed).toString());
            if (this.player.outTracks) this.showArrow("yellow");
            else if (this.player.collisionEffect > 0 && this.player.maxSpeed > this.player.maxSpeedDefault) this.showArrow("green");
            else if (this.player.collisionEffect > 0 && this.player.maxSpeed < this.player.maxSpeedDefault) this.showArrow("red");
            else this.removeArrows();

            // get timer from hud
            let timerSMG = this.hud.getObjectByName("timer");
            let timerHandler = this.hudElements.get(timerSMG);
            timerHandler.load(timerSMG, this.convertTime(this.player.raceTime));

            // get lap from hud
            let lapSMG = this.hud.getObjectByName("lap");
            let lapHandler = this.hudElements.get(lapSMG);
            lapHandler.load(lapSMG, this.lapController.lap.toString() + "/3");

            // get effect from hud
            let effectSMG = this.hud.getObjectByName("effect");
            let effectHandler = this.hudElements.get(effectSMG);
            effectHandler.load(effectSMG, this.convertEffect(this.player.collisionEffect).toString());

            if (pause) {
                let pauseSMG = this.hud.getObjectByName("pause");
                let pauseHandler = this.hudElements.get(pauseSMG);
                pauseHandler.load(pauseSMG, "PAUSE");
            } else {
                let pauseSMG = this.hud.getObjectByName("pause");
                let pauseHandler = this.hudElements.get(pauseSMG);
                pauseHandler.load(pauseSMG, "");
            }
            
            if (this.lapController.lap == 3) { 
                let endSMG = this.hud.getObjectByName("end");
                let endHandler = this.hudElements.get(endSMG);
                endHandler.load(endSMG, "FINISH");
            }
        }
        
    }

}

export { MyHUD };
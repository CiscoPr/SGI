import * as THREE from 'three';
import { InputMenu } from './InputMenu.js';
import { PickingController } from './PickingController.js';

class MainMenu{
    constructor(app){
        this.app = app;
        this.gameTitle = null;

        //this flag will be used for when the user is done with the menu
        // so the app can build the rest of the scene and dispose of the menu
        this.mainMenuDone = false;


        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 1;
        this.raycaster.far = 1100;

        this.pointer = new THREE.Vector2();
        this.intersectedObj = null;
        this.pickingColor = "0xCFE6FF";

        this.availableLayers = ['none', 1, 2, 3]
        this.selectedLayer = this.availableLayers[0]

        this.notPickableObjIds = ["gameTitle", "authors"]
        this.pickingController = new PickingController(this.app, this.raycaster, this.pointer, this.intersectedObj, this.pickingColor, this.availableLayers, this.selectedLayer, this.notPickableObjIds);


        this.build();

        this.mousePressed = false;



        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }


    handleMouseDown(event) {
        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        if(this.mainMenuDone) return;
        switch (event.button) {
            case 0:
                this.mousePressed = true;
                //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);
                // if the mouse clicks on the start game button
                if(this.pointer.x > -0.281 && this.pointer.x < 0.278 && this.pointer.y > -0.42 && this.pointer.y < -0.1){
                    this.mainMenuDone = true;
                }
                break;
        }
    }

    handleMouseUp(event) {
        switch (event.button) {
            case 0:
                this.mousePressed = false;
                break;
        }
    }



    build(){
        this.buildGameTitle("gameTitle", this.availableLayers[1]);
        this.buildStartGameButton("startGame", this.availableLayers[2]);
        this.buildAuthors("authors", this.availableLayers[3]);
        //this.buildListener();

    }

    buildGameTitle(name, layer){
        const gameTitleGeometry = new THREE.PlaneGeometry(1500, 750);
        const gameTitleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
        gameTitleMaterial.transparent = true;
        gameTitleMaterial.side = THREE.DoubleSide;
        this.gameTitle = new THREE.Mesh(gameTitleGeometry, gameTitleMaterial);
        this.gameTitle.name = name;
        this.gameTitle.layers.enable(layer);

        this.gameTitle.position.set(0, 1100, 0);

        // apply texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load('./scene/textures/elements/gametitle.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        this.gameTitle.material.map = texture;
        this.gameTitle.material.side = THREE.DoubleSide;
        this.app.scene.add(this.gameTitle);
    }

    buildStartGameButton(name, layer){
        const startGameGeometry = new THREE.PlaneGeometry(500, 250);
        const startGameMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

        startGameMaterial.transparent = true;
        startGameMaterial.side = THREE.DoubleSide;
        this.startGame = new THREE.Mesh(startGameGeometry, startGameMaterial);
        this.startGame.name = name;
        this.startGame.layers.enable(layer);

        this.startGame.position.set(0, 600, 0);

        // apply texture
        const loader2 = new THREE.TextureLoader();
        const texture2 = loader2.load('./scene/textures/elements/startbuttonInitial.png');
        texture2.wrapS = THREE.RepeatWrapping;
        texture2.wrapT = THREE.RepeatWrapping;
        texture2.repeat.set(1, 1);
        this.startGame.material.map = texture2;
        this.startGame.material.side = THREE.DoubleSide;
        this.app.scene.add(this.startGame);
    }

    buildAuthors(name, layer){
        const authorsGeometry = new THREE.PlaneGeometry(850, 250);
        const authorsMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
        authorsMaterial.transparent = true;
        authorsMaterial.side = THREE.DoubleSide;
        this.authors = new THREE.Mesh(authorsGeometry, authorsMaterial);
        this.authors.name = name;
        this.authors.layers.enable(layer);

        this.authors.position.set(0, 250, 0);

        const loader3 = new THREE.TextureLoader();
        const texture3 = loader3.load('./scene/textures/elements/authors.png');
        texture3.wrapS = THREE.RepeatWrapping;
        texture3.wrapT = THREE.RepeatWrapping;
        texture3.repeat.set(1, 1);
        this.authors.material.map = texture3;
        this.authors.material.side = THREE.DoubleSide;
        this.app.scene.add(this.authors);
    }

    buildListener(){

        const listener = new THREE.AudioListener();
        this.app.activeCamera.add( listener );

        const audioLoader = new THREE.AudioLoader();

        const sound = new THREE.Audio( listener );

        audioLoader.load('./scene/audio/FightOn.mp3', function( buffer ) {
            sound.setBuffer( buffer );
            sound.setLoop( true );
            sound.setVolume( 0.1);
            sound.play();
        } );

        //console.log("listening", this.audioLoader)
    }



    update(){

        //console.log("mainMenu picker", this.pickingController)
        this.gameTitle.lookAt(this.app.activeCamera.position.x, this.gameTitle.position.y, this.app.activeCamera.position.z);
        this.startGame.lookAt(this.app.activeCamera.position.x, this.startGame.position.y, this.app.activeCamera.position.z);
        this.authors.lookAt(this.app.activeCamera.position.x, this.authors.position.y, this.app.activeCamera.position.z);
        if(this.mainMenuDone === true){
            this.app.scene.remove(this.gameTitle);
            this.app.scene.remove(this.startGame);
            this.app.scene.remove(this.authors);
            //only way for the picker to work correctly
            this.raycaster.near = 0;
            this.raycaster.far = 0;
        }

    }
}
export {MainMenu};
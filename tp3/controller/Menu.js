import * as THREE from 'three';

class Menu{
    constructor(app, contents){
        this.app = app;
        this.contents = contents;
        console.log(this.contents);
        this.gameTitle = null;
        //this flag will be used for when the user is done with the menu
        // so the app can build the rest of the scene and dispose of the menu
        this.done = false;

        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 1;
        this.raycaster.far = 1100;

        this.pointer = new THREE.Vector2();
        this.intersectedObj = null;
        this.pickingColor = "0xCFE6FF";

        this.availableLayers = ['none', 1, 2, 3]
        this.selectedLayer = this.availableLayers[0]

        this.notPickableObjIds = ["gameTitle", "authors"]

        this.build();

        document.addEventListener(
            'pointermove',
            this.onPointerMove.bind(this)
        );

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));

    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'w':
                this.done = true;
                break;
        }
    }

    build(){
        this.buildGameTitle("gameTitle", this.availableLayers[1]);
        this.buildStartGameButton("startGame", this.availableLayers[2]);
        this.buildAuthors("authors", this.availableLayers[3]);
        this.buildListener();

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

        console.log("listening", this.audioLoader)
    }


    /*
    *
    * Only object from selected layer will be eligible for selection
    * when 'none' is selected no layer is active, so all objects can be selected
    */
    updateSelectedLayer() {
        this.raycaster.layers.enableAll()
        if (this.selectedLayer !== 'none') {
            const selectedIndex = this.availableLayers[parseInt(this.selectedLayer)]
            this.raycaster.layers.set(selectedIndex)
        }
    }

    /*
    * Update the texture
    *
    */
    updatePickingColor(value) {
        this.pickingColor = value.replace('#', '0x');
    }


    /*
    * Change the color of the first intersected object
    *
    */
    changeColorOfFirstPickedObj(obj) {
        if (this.lastPickedObj != obj) {
            if (this.lastPickedObj)
                this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
            this.lastPickedObj = obj;
            this.lastPickedObj.currentHex = this.lastPickedObj.material.color.getHex();
            this.lastPickedObj.material.color.setHex(this.pickingColor);
        }
    }


    /*
     * Restore the original color of the intersected object
     *
     */
    restoreColorOfFirstPickedObj() {
        if (this.lastPickedObj)
            this.lastPickedObj.material.color.setHex(this.lastPickedObj.currentHex);
        this.lastPickedObj = null;
    }

    /*
    * Helper to visualize the intersected object
    *
    */
    pickingHelper(intersects) {
        let counter = 0;
        if (intersects.length > 0) {
            const obj = intersects[0].object
            if (this.notPickableObjIds.includes(obj.name)) {
                this.restoreColorOfFirstPickedObj()
                console.log("Object cannot be picked !")
            }
            else{
                this.changeColorOfFirstPickedObj(obj)
            }
        } else {
            this.restoreColorOfFirstPickedObj()
        }
    }



    /**
     * Print to console information about the intersected objects
     */
        transverseRaycastProperties(intersects) {
            for (var i = 0; i < intersects.length; i++) {

                console.log(intersects[i]);

                /*
                An intersection has the following properties :
                    - object : intersected object (THREE.Mesh)
                    - distance : distance from camera to intersection (number)
                    - face : intersected face (THREE.Face3)
                    - faceIndex : intersected face index (number)
                    - point : intersection point (THREE.Vector3)
                    - uv : intersection point in the object's UV coordinates (THREE.Vector2)
                */
            }
        }



    onPointerMove(event) {
        // calculate pointer position in normalized device coordinates
        // (-1 to +1) for both components

        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

        //console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);

        //2. set the picking ray from the camera position and mouse coordinates
        this.raycaster.setFromCamera(this.pointer, this.app.activeCamera);

        //3. compute intersections
        var intersects = this.raycaster.intersectObjects(this.app.scene.children);

        this.pickingHelper(intersects)

        this.transverseRaycastProperties(intersects)
    }


    update(){



        this.gameTitle.lookAt(this.app.activeCamera.position.x, this.gameTitle.position.y, this.app.activeCamera.position.z);
        this.startGame.lookAt(this.app.activeCamera.position.x, this.startGame.position.y, this.app.activeCamera.position.z);
        this.authors.lookAt(this.app.activeCamera.position.x, this.authors.position.y, this.app.activeCamera.position.z);
        if(this.done === true){
            this.app.scene.remove(this.gameTitle);
            this.app.scene.remove(this.startGame);
            this.app.scene.remove(this.authors);


        }
    }
}
export {Menu};
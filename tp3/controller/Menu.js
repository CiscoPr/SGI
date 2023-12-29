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
        this.build();

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
        const gameTitleGeometry = new THREE.PlaneGeometry(1500, 750);
        const gameTitleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
        gameTitleMaterial.transparent = true;
        gameTitleMaterial.side = THREE.DoubleSide;
        this.gameTitle = new THREE.Mesh(gameTitleGeometry, gameTitleMaterial);

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

        const startGameGeometry = new THREE.PlaneGeometry(500, 250);
        const startGameMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

        startGameMaterial.transparent = true;
        startGameMaterial.side = THREE.DoubleSide;
        this.startGame = new THREE.Mesh(startGameGeometry, startGameMaterial);

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


        const authorsGeometry = new THREE.PlaneGeometry(850, 250);
        const authorsMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});
        authorsMaterial.transparent = true;
        authorsMaterial.side = THREE.DoubleSide;
        this.authors = new THREE.Mesh(authorsGeometry, authorsMaterial);

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

    update(){
        // add an event listener: if the user clicks on the w button, the game starts



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
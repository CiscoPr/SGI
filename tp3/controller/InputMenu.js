import * as THREE from 'three';

class InputMenu {
    constructor(app, menu){
        this.app = app;
        this.menu = menu;
        this.input = "";
        this.spriteGroup = null;
        this.mousePressed = false;
        this.raycaster = new THREE.Raycaster();
        this.raycaster.near = 1;
        this.raycaster.far = 1100;

        //the usual flag to check it is done
        this.inputDone = false;

        this.pointer = new THREE.Vector2();
        this.intersectedObj = null;
        this.pickingColor = "0xCFE6FF";
        this.next = null;

        this.availableLayers = ['none', 1, 2]
        this.selectedLayer = this.availableLayers[0]

        this.notPickableObjIds = ["input"]
        this.build();

        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    handleMouseDown(event) {
        //of the screen is the origin
        this.pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
        switch (event.button) {
            case 0:
                this.mousePressed = true;
                console.log("Position x: " + this.pointer.x + " y: " + this.pointer.y);
                // if the mouse clicks on the start game button
                if(this.pointer.x > -0.26 && this.pointer.x < 0.275 && this.pointer.y > -0.51 && this.pointer.y < -0.23){
                    this.inputDone = true;
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

        this.buildInput("input", 1);
        this.buildNextButton("next", 2);

    }

    buildInput(name, layer){
        this.spriteGroup = new THREE.Group();
        this.input = "Input your name:";
        for (let i = 0; i < this.input.length; i++) {
            let pos = this.input.charCodeAt(i);
            let j = Math.floor(pos / 16);
            let k = pos % 16;
            let letter = new THREE.PlaneGeometry( 1, 1 );
            let texture = new THREE.TextureLoader().load( 'sprites/spriteLetters.png' );
            texture.flipY = false;
            let offset = 1 / 16;
            let uv = [];
            uv.push(offset * k + offset, offset * j + offset);
            uv.push(offset * k, offset * j + offset);
            uv.push(offset * k + offset, offset * j);
            uv.push(offset * k, offset * j);
            letter.setAttribute("uv", new THREE.BufferAttribute( new Float32Array(uv), 2 ));
            let material = new THREE.MeshBasicMaterial( { map: texture } );
            material.transparent = true;
            material.side = THREE.DoubleSide;
            let mesh = new THREE.Mesh( letter, material );
            mesh.rotation.z = Math.PI;
            mesh.name = name;
            mesh.layers.enable(layer);
            if(i == 0)
                mesh.position.x = -15;
            else
                mesh.position.x = i - 15 ;
            this.spriteGroup.add(mesh);
        }

        this.spriteGroup.scale.x = 100;
        this.spriteGroup.scale.y = 100;
        this.spriteGroup.scale.z = 100;

        //get the width of the spriteGroup
        let width = 0;
        for(let i = 0; i < this.spriteGroup.children.length; i++){
            width += this.spriteGroup.children[i].geometry.parameters.width;
        }

        //center the spriteGroup
        this.spriteGroup.position.x = 0;
        this.spriteGroup.position.z = 0;
        this.spriteGroup.position.y = 900;




        //console.log("group", this.spriteGroup)

        this.app.scene.add( this.spriteGroup );
    }

    buildNextButton(name, layer){
        const nextGeometry = new THREE.PlaneGeometry(500, 250);
        const nextMaterial = new THREE.MeshBasicMaterial({color: 0xffffff});

        nextMaterial.transparent = true;
        nextMaterial.side = THREE.DoubleSide;
        this.next = new THREE.Mesh(nextGeometry, nextMaterial);
        this.next.name = name;
        this.next.layers.enable(layer);

        this.next.position.set(0, 500, 0);

        // apply texture
        const loader = new THREE.TextureLoader();
        const texture = loader.load('./scene/textures/elements/nextButton.png');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(1, 1);
        this.next.material.map = texture;
        this.next.material.side = THREE.DoubleSide;
        this.app.scene.add(this.next);
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



        //

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
        this.next.lookAt(this.app.activeCamera.position.x, this.next.position.y, this.app.activeCamera.position.z);
        this.spriteGroup.lookAt(this.app.activeCamera.position.x, this.spriteGroup.position.y, this.app.activeCamera.position.z);
        if(this.inputDone){
            this.app.scene.remove(this.spriteGroup);
            this.app.scene.remove(this.next);
            this.menu.done = true;
        }
    }

}
export {InputMenu};
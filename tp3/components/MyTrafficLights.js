import * as THREE from 'three';

class MyTrafficLights  {

    constructor() {
        this.trafficLight = this.createTrafficLight();
        this.lastTime = null;
        this.countdown = 10000;
    }

    createTrafficLight() {
        let trafficLight = new THREE.Group();
        trafficLight.name = "trafficLight";

        let geometry = new THREE.BoxGeometry( 4.5, 1.5, 1 );
        let material = new THREE.MeshBasicMaterial( {color: 0x000000} );
        const cube = new THREE.Mesh( geometry, material );
        trafficLight.add( cube );

        // add three caps
        geometry = new THREE.SphereGeometry( 0.5, 32, 16, 0,  Math.PI * 2, 0, Math.PI * 0.3 );
        material = new THREE.MeshPhongMaterial( { color: 0xffff00, emissive: 0xffff00, specular: 0xffff00 } );
        const circle = new THREE.Mesh( geometry, material );
        circle.name = "circle1";
        circle.position.set(-1.5, 0, 0.21);
        circle.rotation.x = Math.PI / 2;
        trafficLight.add( circle );

        material = new THREE.MeshPhongMaterial( { color: 0xffff00, emissive: 0xffff00, specular: 0xffff00 } );
        const circle2 = new THREE.Mesh( geometry, material );
        circle2.name = "circle2";
        circle2.position.set(0, 0, 0.21);
        circle2.rotation.x = Math.PI / 2;
        trafficLight.add( circle2 );

        material = new THREE.MeshPhongMaterial( { color: 0xffff00, emissive: 0xffff00, specular: 0xffff00 } );
        const circle3 = new THREE.Mesh( geometry, material );
        circle3.name = "circle3";
        circle3.position.set(1.5, 0, 0.21);
        circle3.rotation.x = Math.PI / 2;
        trafficLight.add( circle3 );

        // build the pole
        geometry = new THREE.CylinderGeometry( 0.15, 0.15, 2, 32 );
        material = new THREE.MeshBasicMaterial( {color: 0x000000} );
        const cylinder = new THREE.Mesh( geometry, material );
        cylinder.position.set(-1.5, 1, 0);
        trafficLight.add( cylinder );

        // build second pole
        const cylinder2 = new THREE.Mesh( geometry, material );
        cylinder2.position.set(1.5, 1, 0);
        trafficLight.add( cylinder2 );

        // build thin plane and place it on top of the poles
        geometry = new THREE.PlaneGeometry( 0.2, 2 );
        material = new THREE.MeshBasicMaterial( {color: 0x808080, side: THREE.DoubleSide} );
        const plane = new THREE.Mesh( geometry, material );
        plane.position.set(-1.5, 2.01, 0);
        plane.rotation.x = Math.PI / 2;
        plane.name = "helice1";
        trafficLight.add( plane );

        // build second plane and place it on top of the poles
        const plane2 = new THREE.Mesh( geometry, material );
        plane2.position.set(1.5, 2.01, 0);
        plane2.rotation.x = Math.PI / 2;
        plane2.name = "helice2";
        trafficLight.add( plane2 );


        return trafficLight;
    }
 
    update(scene) {
        if (this.lastTime == null) { this.lastTime = Date.now(); return; }

        const trafficLight = scene.getObjectByName("trafficLight");
        
        if (trafficLight) {
            const helice1 = trafficLight.getObjectByName("helice1");
            const helice2 = trafficLight.getObjectByName("helice2");
            helice1.rotation.z = (helice1.rotation.z + 0.8) % (Math.PI * 2);
            helice2.rotation.z = (helice2.rotation.z + 0.8) % (Math.PI * 2);
        }

        trafficLight.position.y += Math.sin(Date.now() * 0.001) / 10;

        if (this.countdown < 0) { return; }

        let elapsedTime = Date.now() - this.lastTime;
        this.countdown -= elapsedTime;
        this.lastTime = Date.now();

        const circle1 = trafficLight.getObjectByName("circle1");
        const circle2 = trafficLight.getObjectByName("circle2");
        const circle3 = trafficLight.getObjectByName("circle3");

        if (this.countdown < 0) {
            circle1.material.color.setHex(0x00ff00);
            circle1.material.emissive.setHex(0x00ff00);
            circle1.material.specular.setHex(0x00ff00);
            circle2.material.color.setHex(0x00ff00);
            circle2.material.emissive.setHex(0x00ff00);
            circle2.material.specular.setHex(0x00ff00);
            circle3.material.color.setHex(0x00ff00);
            circle3.material.emissive.setHex(0x00ff00);
            circle3.material.specular.setHex(0x00ff00);
        } else if (this.countdown < 1000) {
            circle3.material.color.setHex(0xff0000);
            circle3.material.emissive.setHex(0xff0000);
            circle3.material.specular.setHex(0xff0000);
        } else if (this.countdown < 2000) {
            circle2.material.color.setHex(0xff0000);
            circle2.material.emissive.setHex(0xff0000);
            circle2.material.specular.setHex(0xff0000);
        } else if (this.countdown < 3000) {
            circle1.material.color.setHex(0xff0000);
            circle1.material.emissive.setHex(0xff0000);
            circle1.material.specular.setHex(0xff0000);
        }
    }

}

export { MyTrafficLights };
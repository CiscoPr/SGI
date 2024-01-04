import * as THREE from 'three';
import { MyText } from '../components/MyText.js';
import { MyCar } from '../components/MyCar.js';
import { MyFireworks } from '../components/MyFireworks.js';
import { MyHUD } from '../components/MyHUD.js';

class EndGame {
    constructor(app, winner, loser, result, time, dificulty, username) {
        this.app = app;
        this.won = result;
        this.time = time;
        this.winner = winner;
        this.loser = loser;
        this.username = username;
        if (dificulty == 1) this.dificulty = "Easy";
        else if (dificulty == 2) this.dificulty = "Medium";
        else if (dificulty == 3) this.dificulty = "Hard";
        
		this.escapePressed = false;
        this.spacePressed = false;
        this.cleanedUp = false;
		window.addEventListener('keyup', (e) => {
			if (e.key == " ") {
				this.spacePressed = true;
			} else if (e.key == "Escape") {
				this.escapePressed = true;
			}
		});

        // components
        this.winnerCar = null;
        this.loserCar = null;
        this.resultCard = new THREE.Group();
        this.fireworks = null;

		this.init();
	}

    buildCars() {
        this.winnerCar = new MyCar(this.winner);
        this.app.scene.add(this.winnerCar.car);
        // set position and rotation of the car
        this.winnerCar.car.rotation.y = Math.PI/ 6;
        this.winnerCar.car.position.set(3985, 25, 470);

        this.loserCar = new MyCar(this.loser);
        this.app.scene.add(this.loserCar.car);
        this.loserCar.car.rotation.y = -Math.PI/ 6;
        this.loserCar.car.position.set(4020, 25, 450);
        // set position and rotation of the car
    }

    buildWildCards() {
        // create line 1
        let line = new THREE.Group();
        let handler = new MyText(20);
        handler.init(line);
        console.log(this.won);
        let string = (this.won) ? this.winner + "(" + this.username + ") won!" : this.loser + "(" + this.username + ") lost!";
        handler.load(line, string);
        line.position.set((line.children.length / 2), 1, 0);
        this.resultCard.add(line);
        
        // create line 2
        line = new THREE.Group();
        handler = new MyText(20);
        handler.init(line);
        handler.load(line, new MyHUD().convertTime(this.time));
        line.position.set((line.children.length / 2), 0, 0);
        this.resultCard.add(line);

        // create line 3
        line = new THREE.Group();
        handler = new MyText(20);
        handler.init(line);
        handler.load(line, "Difficulty: " + this.dificulty);
        line.position.set((line.children.length / 2), -1, 0);
        this.resultCard.add(line);

        // place result card
        this.app.scene.add(this.resultCard);
        this.resultCard.position.set(3978, 40, 490);
    }

    buildFireworks() {
        this.fireworks = new MyFireworks(this.app.scene);
        this.fireworks.init();

        // set position and scale of the fireworks
        this.fireworks.launcher.scale.set(10, 10, 10);
        this.fireworks.launcher.position.set(4000, 25, 0);
    }

    init() {
        // build cars
        this.buildCars();
        this.buildWildCards();
        this.buildFireworks();
    }

    clean() {
        // remove all components from scene
        this.app.scene.remove(this.winnerCar.car);
        this.app.scene.remove(this.loserCar.car);
        this.app.scene.remove(this.resultCard);
        this.fireworks.remove();
        this.cleanedUp = true;
    }
	
	update() {
        if (this.escapePressed || this.spacePressed) {
            this.clean();
            this.cleanedUp = true;
        }
        if (this.fireworks != null) this.fireworks.update(); 
    }

} export {EndGame};
import * as THREE from 'three';
import { CarController } from './CarController.js';
import { ItemsController } from './ItemsController.js';
import { CollisionController } from './CollisionController.js';
import { AutomaticCarController } from './AutomaticCarController.js';
import { LapController } from './LapController.js';
import { MyBoost } from '../components/MyBoost.js';
import { MyObstacle } from '../components/MyObstacle.js';
import { MyCar } from '../components/MyCar.js';
import { MyTrafficLights } from '../components/MyTrafficLights.js';
import { MyBillboard } from '../components/MyBillboard.js';
import { MyHUD } from '../components/MyHUD.js';
import { MyShader } from '../components/MyShader.js';




class Game{
    constructor(app, characters, player, enemy, track) {
        this.app = app;
        this.characters = characters;
        this.playerStats = player;
        this.enemyStats = enemy;

		// gameflow control
		this.gameState = 0; // 0 - start, 1 - game, 2 - done, 3 - pause
		this.escapePressed = false;
		this.cleanedUp = false;
		this.powerUp = false;
		window.addEventListener('keyup', (e) => {
			if (e.key == " ") {
				if (this.gameState == 1) {
					this.gameState = 3;
				} else if (this.gameState == 3) {
					this.gameState = 1;
				}
			} else if (e.key == "Escape") {
				this.escapePressed = true;
			}
		});
		this.clock = null;

		// components
		this.playerCar = null;
		this.enemyCar = null;
		this.obstacles = [];
		this.boosts = [];
		this.trafficLights = null;
		this.track = track;
		this.shadermesh = null;

		// controllers
		this.carController = null;
		this.itemsController = null;
		this.collisionSystem = null;
		this.automaticCarController = null;
		this.lapController = null;

		// hud
		this.hud = null;
		this.billboard = null;

		this.init();
	}

    init() {
		this.buildComponents();;
		this.placeComponents();
		this.startControllers();
		this.buildHUD()

        //const manager = new THREE.LoadingManager();
        //manager.onLoad = fucntion ( ) {
            //initialize the controllers
        //}
    }

	buildObstacles() {
		const arrayPoints = this.track.path1.getSpacedPoints(10000);
		const randomPoints = [];
		while (randomPoints.length < 20) {
			const randomIndex = Math.floor(Math.random() * arrayPoints.length);
			if (!randomPoints.includes(randomIndex)) { randomPoints.push(randomIndex); }
		}

		for (let i = 0; i < randomPoints.length; i++) {
			const point = arrayPoints[randomPoints[i]];
			point.add(new THREE.Vector3().random().multiplyScalar(150));
			point.y = 50;
			const type = Math.random() > 0.5 ? 'speed' : 'time';

			if(type == 'speed'){
				this.shadermesh = new MyShader(this.app, "shader", "no description provided", "shaders/obstacle.vert", "shaders/obstacle.frag", {
					time: {type:'f', value: 0.0 },
					radius: {type:'f', value: 20.0},
					color: {type: 'vec4', value: new THREE.Vector4(255.0, 0.0, 0.0, 1.0)},
				});
			}else{
				this.shadermesh = new MyShader(this.app, "shader", "no description provided", "shaders/obstacle.vert", "shaders/obstacle.frag", {
					time: {type:'f', value: 0.0 },
					radius: {type:'f', value: 20.0},
					color: {type: 'vec4', value: new THREE.Vector4(255.0, 165.0, 0.0, 1.0)},
				});
			}

			setTimeout(()=>{
				const obstacle = new MyObstacle(type, point, this.app.scene);
				obstacle.helper.children[0].material = this.shadermesh.material;
				obstacle.helper.children[0].needsUpdate = true;
				this.obstacles.push(obstacle);

			}, 3000);
		}
	}

	buildBoosts() {
		const arrayPoints = this.track.path1.getSpacedPoints(10000);
		const randomPoints = [];
		while (randomPoints.length < 50) {
			const randomIndex = Math.floor(Math.random() * arrayPoints.length);
			if (!randomPoints.includes(randomIndex)) { randomPoints.push(randomIndex); }
		}

		for (let i = 0; i < randomPoints.length; i++) {
			const point = arrayPoints[randomPoints[i]];
			point.add(new THREE.Vector3().random().multiplyScalar(150));
			point.y = 50;
			const type = Math.random() > 0.5 ? 'speed' : 'time';
			const boost = new MyBoost(type, point, this.app.scene);
			this.boosts.push(boost);
		}
	}

	buildHUD() {
		// build hud
		this.hud = new MyHUD(this.carController, this.lapController);
		this.hud.init(this.app.scene);

		// build and place billboard
		this.billboard = new MyBillboard(this.carController, this.lapController);
		this.billboard.init(this.app.scene);
		// modify position, rotation and scale
		this.billboard.hud.scale.set(300, 300, 300);
		this.billboard.hud.position.set(-6100, 1200, 0);
		this.billboard.hud.rotation.y = Math.PI / 2;
	}

	buildComponents() {
		this.playerCar = new MyCar(this.characters[0]);
		this.enemyCar = new MyCar(this.characters[1]);
		this.buildBoosts();
		this.buildObstacles();
		this.trafficLights = new MyTrafficLights();
	}

	placeComponents() {
		// player car
		this.app.scene.add(this.playerCar.car);
		// modify position, rotation and scale
		this.playerCar.car.position.set(4060, 25, 0);

		// enemy car
		this.app.scene.add(this.enemyCar.car);
		// modify position, rotation and scale
		this.enemyCar.car.position.set(4000, 25, 0);

		// traffic lights
		this.app.scene.add(this.trafficLights.trafficLight);
		// modify position, rotation and scale
		this.trafficLights.trafficLight.position.set(4050, 50, 0);
		this.trafficLights.trafficLight.rotation.y = Math.PI;

	}

	startControllers() {
		// start controllers
		this.carController = new CarController(this.playerCar.car, this.playerCar.carWheels, this.track, this.playerStats[0], this.playerStats[1], this.playerStats[2]);
		this.itemsController = new ItemsController(this.boosts, this.obstacles);
		this.collisionSystem = new CollisionController(this.carController, this.itemsController, this.playerCar, this.enemyCar, this.boosts, this.obstacles);
		this.automaticCarController = new AutomaticCarController(this.app, this.enemyCar.car, this.enemyCar.carWheels, this.track, this.enemyStats[0], this.characters[1]);
		this.lapController = new LapController(this.app, this.playerCar, this.track);
        this.lapController2 = new LapController(this.app, this.enemyCar, this.track);
	}

	updateStartGame() {
		if (this.trafficLights == null) return;
		this.trafficLights.update(this.app.scene);
		if (this.trafficLights.countdown < 0) { this.gameState = 1; }
	}


	updateGame() {

		if (this.collisionSystem != null) this.powerUp = this.collisionSystem.update();
		if (this.itemsController != null) this.itemsController.update();
		if (this.hud != null) this.hud.update(this.app.activeCamera, false);
		if (this.trafficLights != null) this.trafficLights.update(this.app.scene);
		if (this.billboard != null) this.billboard.update();


		if (this.carController != null) {
			this.carController.pause = false;
			this.carController.update();
			this.lapController.update();
		}


		if (this.automaticCarController != null) {
			this.automaticCarController.mixerPause = false;
			this.automaticCarController.update();
			this.lapController2.update();
		}

		if (this.lapController != null && this.lapController.lap == 3) {
			if (this.clock == null) { this.clock = Date.now(); }
			if (Date.now() - this.clock > 5000) { this.gameState = 2; console.log("Game Over"); }
		}
	}

	pause() {
		if (this.hud != null) this.hud.update(this.app.activeCamera, (this.gameState == 3), true);
		this.carController.updateClock();
		this.carController.pause = true;
		this.itemsController.updateClock();
		this.automaticCarController.mixerPause = true;
		this.automaticCarController.update();
	}

	placerPause() {
		this.carController.updateClock();
		this.carController.pause = true;
		this.itemsController.updateClock();
		this.automaticCarController.mixerPause = true;
		this.automaticCarController.update();
	}

	update() {
		if(this.shadermesh != null){
            this.shadermesh.uniformValues.time.value += 0.01;
        }

		if (this.escapePressed) {
			// delete obstacles and boosts
			this.obstacles.forEach(obstacle => this.app.scene.remove(obstacle.helper));
			this.boosts.forEach(boost => this.app.scene.remove(boost.helper));

			// delete hud and billboard
			this.app.scene.remove(this.hud.hud);
			this.app.scene.remove(this.billboard.hud);

			// delete cars
			this.app.scene.remove(this.playerCar.car);
			this.app.scene.remove(this.enemyCar.car);

			// delete traffic lights
			this.app.scene.remove(this.trafficLights.trafficLight);

			this.cleanedUp = true;

			return;
		}

		if (this.powerUp) {this.placerPause(); return;}

		if (this.gameState == 0) {
			this.updateStartGame();
		} else if (this.gameState == 1) {
			this.updateGame();
		} else if (this.gameState == 3) {
			this.pause();
		}
	}

} export {Game};
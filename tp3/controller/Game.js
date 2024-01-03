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



class Game{
    constructor(app, characters, player, enemy, track) {
        this.app = app;
        this.characters = characters;
        this.playerStats = player;
        this.enemyStats = enemy;
        
		// gameflow control
		this.gameState = 0; // 0 - start, 1 - game, 2 - done, 3 - pause
		window.addEventListener('keyup', (e) => {
			if (e.key == " ") {
				if (this.gameState == 1) {
					this.gameState = 3;
				} else if (this.gameState == 3) {
					this.gameState = 1;
				}
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

	buildObstcles() { 
		// build obstacles
	}

	buildBoosts() {
		// build boosts
	}
	
	buildHUD() {
		// build hud
		this.hud = new MyHUD(this.carController, this.lapController);
		this.hud.init(this.app.scene);

		// build and place billboard
		this.billboard = new MyBillboard(this.carController, this.lapController);
		this.billboard.init(this.app.scene);
		// modify position, rotation and scale
	}

	buildComponents() {
		this.playerCar = new MyCar(this.characters[0]);
		this.enemyCar = new MyCar(this.characters[1]);
		this.buildBoosts();
		this.buildObstcles();
		this.trafficLights = new MyTrafficLights();
	}

	placeComponents() {
		// player car
		this.app.scene.add(this.playerCar.car);
		// modify position, rotation and scale

		// enemy car
		this.app.scene.add(this.enemyCar.car);
		// modify position, rotation and scale

		// traffic lights
		this.app.scene.add(this.trafficLights.trafficLight);
		// modify position, rotation and scale

	}
	
	startControllers() {
		// start controllers
		this.carController = new CarController(this.playerCar.car, this.playerCar.carWheels, this.track, this.playerStats[0], this.playerStats[1], this.playerStats[2]);
		this.itemsController = new ItemsController(this.boosts, this.obstacles);
		this.collisionSystem = new CollisionController(this.carController, this.itemsController, this.playerCar, this.boosts, this.obstacles);
		this.automaticCarController = new AutomaticCarController(this.app, this.enemyCar.car, this.enemyCar.carWheels, this.track);
		this.lapController = new LapController(this.app, this.playerCar, this.track);
        this.lapController2 = new LapController(this.app, this.enemyCar, this.track);
	}

	updateStartGame() {
		if (this.trafficLights == null) return;
		this.trafficLights.update(this.app.scene);
		if (this.trafficLights.countdown < 0) { this.gameState = 1; }
	}


	updateGame() {
		if (this.collisionSystem != null) this.collisionSystem.update();
		if (this.itemsController != null) this.itemsController.update();
		if (this.hud != null) this.hud.update(this.app.activeCamera, false);
		if (this.trafficLights != null) this.trafficLights.update(this.app.scene);
		if (this.billboard != null) this.billboard.update();


		if (this.carController != null) {
			this.carController.update();
			this.lapController.update();
		}

		if (this.automaticCarController != null) {
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
	}

	update() {
		if (this.gameState == 0) {
			this.updateStartGame();
		} else if (this.gameState == 1) {
			this.updateGame();
		} else if (this.gameState == 3) {
			this.pause();
		}
	}

} export {Game};
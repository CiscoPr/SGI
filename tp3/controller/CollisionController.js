import * as THREE from 'three';

class CollisionController {
    constructor(carControler, itemsControler, playerCar, enemyCar, boosts, obstacles) {
        this.carControler = carControler;
        this.itemsControler = itemsControler;
        this.playerCar = playerCar;
        this.enemyCar = enemyCar;
        this.boosts = boosts;
        this.obstacles = obstacles;
    }

    checkBoosts() {
        let chassisCenter = this.playerCar.getChassisCenter();
        let boost = this.boosts.find(boost => 
            (boost.position.distanceTo(chassisCenter) < boost.radius + this.playerCar.radius) && boost.active);

        if(boost) {
            this.carControler.boostCollision(boost.type);
            this.itemsControler.deactivateBoost(boost);
            return true;
        }
        
        return false;
    }

    checkObstacles() {
        let chassisCenter = this.playerCar.getChassisCenter();
        console.log(this.obstacles);
        let obstacle = this.obstacles.find(obstacle => 
            (obstacle.position.distanceTo(chassisCenter) < obstacle.radius + this.playerCar.radius) && obstacle.active);

        if(obstacle) {
            this.carControler.obstacleCollision(obstacle.type);
            this.itemsControler.deactivateObstacle(obstacle);
        }
    }

    checkEnemy() {
        let chassisCenter = this.playerCar.getChassisCenter();
        let chassisCenterEnemy = this.enemyCar.getChassisCenter();

        if (chassisCenter.distanceTo(chassisCenterEnemy) < this.playerCar.radius + this.enemyCar.radius) {
            let force = chassisCenter.sub(chassisCenterEnemy);
            this.playerCar.car.position.add(force);
            this.carControler.enemyCollision();
        }
        
    }

    checkCollisions() {
        this.checkObstacles();
        this.checkEnemy();
        return this.checkBoosts();
    }

    checkMapBounds() {
        let chassisCenter = this.playerCar.getChassisCenter();

        // update map bounds
        if(chassisCenter.x > 5000) this.playerCar.car.position.x -= chassisCenter.x - 5000;
        else if(chassisCenter.x < -5950) this.playerCar.car.position.x -= chassisCenter.x + 5950;
        else if(chassisCenter.z > 6900) this.playerCar.car.position.z -= chassisCenter.z - 6900;
        else if(chassisCenter.z < -6500) this.playerCar.car.position.z -= chassisCenter.z + 6500;
    }


    update() {
        this.checkMapBounds();
        return this.checkCollisions();
    }

}

export { CollisionController };
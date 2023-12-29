import * as THREE from 'three';

class CollisionController {
    constructor(carControler, itemsControler, playerCar, boosts, obstacles) {
        this.carControler = carControler;
        this.itemsControler = itemsControler;
        this.playerCar = playerCar;
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
        } 
        
    }

    checkObstacles() {
        let chassisCenter = this.playerCar.getChassisCenter();
        let obstacle = this.obstacles.find(obstacle => 
            (obstacle.position.distanceTo(chassisCenter) < obstacle.radius + this.playerCar.radius) && obstacle.active);

        if(obstacle) {
            this.carControler.obstacleCollision(obstacle.type);
            this.itemsControler.deactivateObstacle(obstacle);
        }
    }

    checkCollisions() {
        this.checkBoosts();
        this.checkObstacles();
    }

    checkMapBounds() {
        let chassisCenter = this.playerCar.getChassisCenter();

        if(chassisCenter.x > 5000) this.playerCar.car.position.x -= chassisCenter.x - 5000;
        else if(chassisCenter.x < -6000) this.playerCar.car.position.x -= chassisCenter.x + 6000;
        else if(chassisCenter.z > 6500) this.playerCar.car.position.z -= chassisCenter.z - 6500;
        else if(chassisCenter.z < -6500) this.playerCar.car.position.z -= chassisCenter.z + 6500;
    }

    update() {
        this.checkCollisions();
        this.checkMapBounds();
    }

}

export { CollisionController };
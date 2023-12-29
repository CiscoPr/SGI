import * as THREE from 'three';

class ItemsController {
    constructor(boosts, obstacles) {
        // items records
        this.boosts = boosts;
        this.obstacles = obstacles;

        // items timers
        this.lastTime = Date.now();

        // associate an array of timers to each item
        this.boostTimers = new Array(this.boosts.length, 0);
        this.obstacleTimers = new Array(this.obstacles.length, 0);
    }

    deactivateBoost(boost) {
        this.boostTimers[this.boosts.indexOf(boost)] = 5000;
        boost.active = false;
        boost.mesh.visible = false;
    }

    deactivateObstacle(obstacle) {
        this.obstacleTimers[this.obstacles.indexOf(obstacle)] = 3000;
        obstacle.active = false;
        obstacle.mesh.visible = false;
    }

    updateBoosts() {
        let elapsedTime = Date.now() - this.lastTime;

        this.boostTimers.forEach((timer, index) => {
            if (timer > 0) this.boostTimers[index] -= elapsedTime;
            else {
                this.boosts[index].active = true;
                this.boostTimers[index] = 0;
                this.boosts[index].mesh.visible = true;
            }
        });
    }

    updateObstacles() {
        let elapsedTime = Date.now() - this.lastTime;

        this.obstacleTimers.forEach((timer, index) => {
            if (timer > 0) this.obstacleTimers[index] -= elapsedTime;
            else {
                this.obstacles[index].active = true;
                this.obstacleTimers[index] = 0;
                this.obstacles[index].mesh.visible = true;
            }
        });
    }

    update() {
        this.updateBoosts();
        this.updateObstacles();

        // update last time
        this.lastTime = Date.now();
    }

}

export { ItemsController };
import * as THREE from 'three';

class ItemsController {
    constructor(boosts, obstacles) {
        // items records
        this.boosts = boosts;
        this.obstacles = obstacles;

        // items timers
        this.lastTime = Date.now();

        // associate an array of timers to each item
        this.boostTimers = new Array();
        this.obstacleTimers = new Array();

        for (let i = 0; i < this.boosts.length; i++) { this.boostTimers.push(0); }
        for (let i = 0; i < this.obstacles.length; i++) { this.obstacleTimers.push(0); }
        
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

    addObstacle(obstacle) {
        this.obstacles.push(obstacle);
        this.obstacleTimers.push(0);
    }

    addBoost(boost) {
        this.boosts.push(boost);
        this.boostTimers.push(0);
    }

    update() {
        this.updateBoosts();
        this.updateObstacles();

        // update last time
        this.lastTime = Date.now();
    }

}

export { ItemsController };
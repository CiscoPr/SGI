import * as THREE from 'three';
import { MyObstacle } from '../components/MyObstacle.js';

class ObstaclePlacing{
    constructor(app, obsName) {
        this.app = app;
        this.obsName = obsName;

        this.mousePressed = false;
        this.escapePressed = false;

        window.addEventListener('keydown', (e) => this.handleKeyDown(e));
        window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
        window.addEventListener('mouseup', (e) => this.handleMouseUp(e));
    }

    handleKeyDown(event) {
        switch (event.key) {
            case 'Escape':
                this.escapePressed = true;
                break;
        }
    }

    

} export { ObstaclePlacing };
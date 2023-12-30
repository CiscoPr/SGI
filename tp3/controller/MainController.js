import * as THREE from 'three';
import { MainMenu } from './MainMenu.js';
import { InputMenu } from './InputMenu.js';
import { CarSelector } from './CarSelector.js';
// import the rest of the menus

class MainController{

    constructor(app){
        this.app = app;
        this.mainMenu = null;
        this.inputMenu = null;
        this.carSelector = null;
        this.enemySelector = null;
        this.objectsSelector = null;

        //flags to check if the user is done with each of the menus
        this.mainMenuFlag = false;
        this.inputMenuFlag = false;
        this.carSelectorFlag = false;
        this.enemySelectorFlag = false;
        this.objectsSelectorFlag = false;

        //this counter will keep track of which menu we are in. For example:
        // 0 = main menu
        // 1 = input menu
        // 2 = car selector
        // 3 = enemy selector and so on...
        this.phaseCounter = 0;

        this.game = null;
        this.build();
    }

    build(){

        switch(this.phaseCounter){
            case 0:
                this.mainMenu = new MainMenu(this.app);
                break;
            case 1:
                this.inputMenu = new InputMenu(this.app);
                break;
            case 2:
                //this.carSelector = new CarSelector(this.app);
                break;
            case 3:
                //this.enemySelector = new EnemySelector(this.app);
                break;
            case 4:
                //this.objectsSelector = new ObjectsSelector(this.app);
                break;
            case 5:
                //this.game = new Game(this.app);
                break;
        }

        this.phaseCounter++;


    }

    update(){

        //we start with the main menu
        if(this.mainMenuFlag == false && this.phaseCounter == 1){
            this.mainMenu.update();
            this.mainMenuFlag = this.mainMenu.mainMenuDone;
            console.log("the main:", this.mainMenuFlag);
        }

        else if(this.mainMenuFlag == true && this.phaseCounter == 1){
            this.build();
        }

        //then we go to the input menu
        else if(this.inputMenuFlag == false && this.phaseCounter == 2){
            this.inputMenu.update();
            this.inputMenuFlag = this.inputMenu.inputDone;
            console.log("the input:", this.inputMenuFlag);
        }

    }


} export {MainController};
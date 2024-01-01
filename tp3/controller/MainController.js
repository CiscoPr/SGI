import * as THREE from 'three';
import { MainMenu } from './MainMenu.js';
import { InputMenu } from './InputMenu.js';
import { CarSelector } from './CarSelector.js';
import { EnemySelector } from './EnemySelector.js';
import { ObstacleSelector } from './ObstacleSelector.js';
// import the rest of the menus

class MainController{

    constructor(app){
        this.app = app;
        this.mainMenu = null;
        this.inputMenu = null;
        this.carSelector = null;
        this.enemySelector = null;
        this.obstacleSelector = null;

        //flags to check if the user is done with each of the menus
        this.mainMenuFlag = false;
        this.inputMenuFlag = false;
        this.carSelectorFlag = false;
        this.enemySelectorFlag = false;
        this.obstacleSelectorFlag = false;

        //this counter will keep track of which menu we are in. For example:
        // 0 = main menu
        // 1 = input menu
        // 2 = car selector
        // 3 = enemy selector and so on...
        this.phaseCounter = 0;

        //this will be used to keep track of the user name
        this.userName = "";

        //this will be used to keep track of the player character and the enemy character
        this.playersCharacter = "";
        this.enemyCharacter = "";

        //this will be used to keep track of automatic/manual player mode (manual by default)
        this.manual = true;

        //this will be used to keep track of the diffculty level of the enemy (1 by default)
        this.difficulty = 1;


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
                this.carSelector = new CarSelector(this.app);
                break;
            case 3:
                this.enemySelector = new EnemySelector(this.app);
                break;
            case 4:
                this.obstacleSelector = new ObstacleSelector(this.app);
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
            //console.log("the main:", this.mainMenuFlag);
        }

        else if (this.mainMenuFlag == true && this.phaseCounter == 1) {
            this.mainMenu = null; // might remove later
            this.build();
        }

        //then we go to the input menu
        else if(this.inputMenuFlag == false && this.phaseCounter == 2){
            this.inputMenu.update();
            this.inputMenuFlag = this.inputMenu.inputDone;
            //console.log("the input:", this.inputMenuFlag);
        }

        else if (this.inputMenuFlag == true && this.phaseCounter == 2) {
            this.userName = this.inputMenu.getInputName();
            this.inputMenu = null; // might remove later
            console.log("The user name is:", this.userName)
            this.build();
        }

        //then we go to the car selector
        else if (this.carSelectorFlag == false && this.phaseCounter == 3) {
            this.carSelector.update();
            console.log("The user name is:", this.userName)
            this.carSelectorFlag = this.carSelector.carSelectorDone;
            //console.log("the car:", this.carSelectorFlag);
        }

        else if (this.carSelectorFlag == true && this.phaseCounter == 3) {
            this.playersCharacter = this.carSelector.getSelectedCharacter();
            console.log("The player selected:", this.playersCharacter)
            this.carSelector = null; // might remove later
            this.build();
        }

        //then we go to the enemy selector
        else if (this.enemySelectorFlag == false && this.phaseCounter == 4) {
            this.enemySelector.update();
            this.enemySelectorFlag = this.enemySelector.enemySelectorDone;
            //console.log("the enemy:", this.enemySelectorFlag);
        }

        else if (this.enemySelectorFlag == true && this.phaseCounter == 4) {
            this.enemyCharacter = this.enemySelector.getSelectedCharacter();
            console.log("The enemy selected:", this.enemyCharacter)
            this.enemySelector = null; // might remove later
            this.build();
        }

        //then we go to the obstacle selector
        else if (this.obstacleSelectorFlag == false && this.phaseCounter == 5) {
            this.obstacleSelector.update();
            this.obstacleSelectorFlag = this.obstacleSelector.obsSelectorDone;
        }

        else if (this.obstacleSelectorFlag == true && this.phaseCounter == 5) {
            this.obstacleSelector = null; // might remove later
            this.build();
        }

    }


} export {MainController};
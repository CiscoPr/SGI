import * as THREE from 'three';
import { MainMenu } from './MainMenu.js';
import { InputMenu } from './InputMenu.js';
import { CarSelector } from './CarSelector.js';
import { EnemySelector } from './EnemySelector.js';
import { ObstacleSelector } from './ObstacleSelector.js';
import { ObstaclePlacing } from './ObstaclePlacing.js';
import { Game } from './Game.js';
import { EndGame } from './EndGame.js';
// import the rest of the menus

class MainController{

    constructor(app){
        this.app = app;
        this.mainMenu = null;
        this.inputMenu = null;
        this.carSelector = null;
        this.enemySelector = null;
        this.obstacleSelector = null;
        this.obstaclePlacer = null;
        this.game = null;
        this.endGame = null;
        this.track = null;

        //flags to check if the user is done with each of the menus
        this.mainMenuFlag = false;
        this.inputMenuFlag = false;
        this.carSelectorFlag = false;
        this.enemySelectorFlag = false;
        this.gameFlag = 0;
        this.obstacleSelectorFlag = false;
        this.obstaclePlacerFlag = false;

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
        this.obstacleName = "";

        //this will be used to keep track of the data of the selected player car
        this.playerMaxSpeed = 0;
        this.playerAcceleration = 0;
        this.playerBrakeSpeed = 0;

        //this will be used to keep track of the diffculty level of the enemy (1 by default)
        this.difficulty = 1;

        // results of game
        this.result = "";
        this.time = -1;
        this.winner = "";
        this.loser = "";

        //this will be used to keep track of the enemy acceleration
        this.enemyAcceleration = 0;

        //this will be used as the counter for how many times the escape key has been pressed
        //the instruction will only be valid if the escape key has been pressed 1 time
        this.escapeCounter = 0;

        this.build();

    }

    setTrack(track) { this.track = track; }

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
                let characters = [this.playersCharacter, this.enemyCharacter];
                let player = [this.playerMaxSpeed, this.playerAcceleration, this.playerBrakeSpeed];
                let enemy = [this.enemyAcceleration];
                this.game = new Game(this.app, characters, player, enemy, this.track);
                break;    
            case 6:
                this.obstacleSelector = new ObstacleSelector(this.app); 
                break;
            case 8:
                this.obstaclePlacer = new ObstaclePlacing(this.app, this.obstacleName);
                break;
            case 10:
                this.endGame = new EndGame(this.app, this.winner, this.loser, this.result, this.time, this.difficulty, this.userName);
                break;
            
        }

        this.phaseCounter++;


    }

    reset(){
        this.mainMenu = null;
        this.inputMenu = null;
        this.carSelector = null;
        this.enemySelector = null;
        this.obstacleSelector = null;
        this.game = null;
        this.gameFlag = 0;
        this.endGame = null;

        this.mainMenuFlag = false;
        this.inputMenuFlag = false;
        this.carSelectorFlag = false;
        this.enemySelectorFlag = false;
        this.obstacleSelectorFlag = false;

        this.phaseCounter = 0;
        this.userName = "";

        this.playersCharacter = "";
        this.enemyCharacter = "";

        this.playerMaxSpeed = 0;
        this.playerAcceleration = 0;
        this.playerBrakeSpeed = 0;

        this.difficulty = 1;
        this.results = "";
        this.time = -1;
        this.winner = "";
        this.loser = "";


        this.enemyAcceleration = 0;


        this.build();
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
            if(this.inputMenu.getEscapePressed()) this.reset();
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
            if(this.carSelector.getEscapePressed()) this.reset();
            //console.log("the car:", this.carSelectorFlag);
        }

        else if (this.carSelectorFlag == true && this.phaseCounter == 3) {
            this.playersCharacter = this.carSelector.getSelectedCharacter();
            this.playerMaxSpeed = this.carSelector.getSelectedMaxSpeed();
            this.playerAcceleration = this.carSelector.getSelectedAcceleration();
            this.playerBrakeSpeed = this.carSelector.getSelectedBrakeSpeed();
            console.log("The player selected:", this.playersCharacter, this.playerMaxSpeed, this.playerAcceleration, this.playerBrakeSpeed)
            this.build();
        }

        //then we go to the enemy selector
        else if (this.enemySelectorFlag == false && this.phaseCounter == 4) {
            this.enemySelector.update();
            this.enemySelectorFlag = this.enemySelector.enemySelectorDone;
            if(this.enemySelector.getEscapePressed()) this.reset();
            //console.log("the enemy:", this.enemySelectorFlag);
        }

        else if (this.enemySelectorFlag == true && this.phaseCounter == 4) {
            this.enemyCharacter = this.enemySelector.getSelectedCharacter();
            this.difficulty = this.enemySelector.getDifficulty();
            this.enemyAcceleration = this.enemySelector.getAcceleration();
            console.log("The enemy selected:", this.enemyCharacter, this.difficulty, this.enemyAcceleration)
            this.build();
        }

        //then we go to the game
        else if (this.gameFlag != 2 && this.phaseCounter == 5){
            this.game.update();
            this.gameFlag = this.game.gameState;
            if (this.game.powerUp) {this.phaseCounter++; this.build(); }
            if (this.game.escapePressed && this.game.cleanedUp) this.reset();
        }

        else if(this.gameFlag == 2 && this.phaseCounter == 5){
            this.result = this.game.victory;
            this.time = this.game.raceTime;
            this.winner = (this.game.victory) ? this.playersCharacter : this.enemyCharacter;
            this.loser = (this.game.victory) ? this.enemyCharacter : this.playersCharacter;
            this.game.clean();
            this.game = null;
            this.phaseCounter += 5;
            this.build();
        }
        
        //then we go to the obstacle selector
        else if (this.obstacleSelectorFlag == false && this.phaseCounter == 7) {
            this.obstacleSelector.update();
            this.game.update();
            this.obstacleSelectorFlag = this.obstacleSelector.obsSelectorDone;
            this.obstacleName = this.obstacleSelector.getObsSelected();
            if(this.obstacleSelector.getEscapePressed()) {
                this.game.clean();
                this.reset();   
            }
        }

        else if (this.obstacleSelectorFlag == true && this.phaseCounter == 7) {
            this.obstacleSelector = null; // might remove later
            this.game.update();
            this.phaseCounter++;
            this.build();
        }

        //then we go to the obstacle placer
        else if (this.obstaclePlacerFlag == false && this.phaseCounter == 9) {
            this.obstaclePlacerFlag = this.obstaclePlacer.obsPlacerDone;
            this.game.update();
            if(this.obstaclePlacer.getEscapePressed()) {
                this.game.clean();
                this.reset();
            }
        }

        else if (this.obstaclePlacerFlag == true && this.phaseCounter == 9) {
            console.log(this.game.powerUp)
            this.game.itemsController.addObstacle(this.obstaclePlacer.obstacle);
            this.game.powerUp = false;
            this.game.update();
            this.phaseCounter -= 4;
            this.obstaclePlacerFlag = false;
            this.obstacleSelectorFlag = false;
        }

        else if (this.phaseCounter == 11) {
            this.endGame.update();
            if (this.endGame.escapePressed && this.endGame.cleanedUp ) { this.reset(); } 
            else if (this.endGame.spacePressed && this.endGame.cleanedUp) {
                this.phaseCounter -= 7;
                this.gameFlag = 0;
                this.endGame = null;
            }
        }

        console.log("everything:", this.userName, this.playersCharacter, this.playerMaxSpeed, this.playerAcceleration, this.playerBrakeSpeed, this.enemyCharacter, this.difficulty, this.enemyAcceleration, this.obstacleName)

    }


} export {MainController};
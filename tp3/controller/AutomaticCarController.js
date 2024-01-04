import * as THREE from 'three';
import { WheelController } from './WheelController.js';

class AutomaticCarController {
    constructor(app, model, wheels, track, acceleration) {
        this.app = app;
        this.model = model;
        this.wheels = wheels;
        this.track = track;
        this.speed = 0;
        this.defaultAcceleration = acceleration;
        this.acceleration = acceleration;

        this.turnSpeed = 0;
        this.maxTurnSpeed = 0.03;
        this.direction = 1;
        this.turning = false;
        this.turnDirection = 0;
        this.wheelController = null;
        this.clock = new THREE.Clock();
        this.mixerTime = 0;
        this.mixerPause = false;
        this.enableAnimationPosition = true;
        this.animationMaxDuration = 1000;
        this.counter = 0;

        this.keyPoints = [
            new THREE.Vector3(4000, 25, 0),
            new THREE.Vector3(4100, 25, 1000),
            new THREE.Vector3(4200, 25, 2000),
            new THREE.Vector3(4300, 25, 3000),
            new THREE.Vector3(4400, 25, 4000),
            new THREE.Vector3(4400, 25, 5000),
            new THREE.Vector3(4000, 25, 6000),
            new THREE.Vector3(3500, 25, 6300),
            new THREE.Vector3(3000, 25, 6400),
            new THREE.Vector3(2000, 25, 6400),
            new THREE.Vector3(1000, 25, 6300),
            new THREE.Vector3(0, 25, 6150),
            new THREE.Vector3(-1000, 25, 6050),
            new THREE.Vector3(-1500, 25, 6000),
            new THREE.Vector3(-2500, 25, 6100),
            new THREE.Vector3(-3500, 25, 6200),
            new THREE.Vector3(-4000, 25, 6000),
            new THREE.Vector3(-4450, 25, 5000),
            new THREE.Vector3(-4500, 25, 4000),
            new THREE.Vector3(-4450, 25, 3000),
            new THREE.Vector3(-4000, 25, 2000),
            new THREE.Vector3(-3500, 25, 1750),
            new THREE.Vector3(-3000, 25, 1800),
            new THREE.Vector3(-2000, 25, 1900),
            new THREE.Vector3(-1000, 25, 2000),
            new THREE.Vector3(0, 25, 2100),
            new THREE.Vector3(1000, 25, 2200),
            new THREE.Vector3(1500, 25, 2250),
            new THREE.Vector3(2000, 25, 2000),
            new THREE.Vector3(2300, 25, 1500),
            new THREE.Vector3(2400, 25, 1000),
            new THREE.Vector3(2500, 25, 0),
            new THREE.Vector3(2000, 25, -1000),
            new THREE.Vector3(1500, 25, -1250),
            new THREE.Vector3(1000, 25, -1200),
            new THREE.Vector3(0, 25, -1100),
            new THREE.Vector3(-1000, 25, -1000),
            new THREE.Vector3(-2000, 25, -900),
            new THREE.Vector3(-3000, 25, -800),
            new THREE.Vector3(-4000, 25, -700),
            new THREE.Vector3(-5000, 25, -1000),
            new THREE.Vector3(-5500, 25, -2000),
            new THREE.Vector3(-5500, 25, -3000),
            new THREE.Vector3(-5500, 25, -4000),
            new THREE.Vector3(-5000, 25, -5000),
            new THREE.Vector3(-4000, 25, -5500),
            new THREE.Vector3(-3000, 25, -5650),
            new THREE.Vector3(-2000, 25, -5700),
            new THREE.Vector3(-1000, 25, -5700),
            new THREE.Vector3(0, 25, -5600),
            new THREE.Vector3(1000, 25, -5500),
            new THREE.Vector3(2000, 25, -5350),
            new THREE.Vector3(3000, 25, -5000),
            new THREE.Vector3(3500, 25, -4500),
            new THREE.Vector3(4000, 25, -3500),
            new THREE.Vector3(4000, 25, -2500),
            new THREE.Vector3(4000, 25, -2000),
            new THREE.Vector3(4000, 25, -1000),
            new THREE.Vector3(4000, 25, 0),
            new THREE.Vector3(4100, 25, 1000),
            new THREE.Vector3(4200, 25, 2000),
            new THREE.Vector3(4300, 25, 3000),
            new THREE.Vector3(4400, 25, 4000),
            new THREE.Vector3(4400, 25, 5000),
            new THREE.Vector3(4000, 25, 6000),
            new THREE.Vector3(3500, 25, 6300),
            new THREE.Vector3(3000, 25, 6400),
            new THREE.Vector3(2000, 25, 6400),
            new THREE.Vector3(1000, 25, 6300),
            new THREE.Vector3(0, 25, 6150),
            new THREE.Vector3(-1000, 25, 6050),
            new THREE.Vector3(-1500, 25, 6000),
            new THREE.Vector3(-2500, 25, 6100),
            new THREE.Vector3(-3500, 25, 6200),
            new THREE.Vector3(-4000, 25, 6000),
            new THREE.Vector3(-4450, 25, 5000),
            new THREE.Vector3(-4500, 25, 4000),
            new THREE.Vector3(-4450, 25, 3000),
            new THREE.Vector3(-4000, 25, 2000),
            new THREE.Vector3(-3500, 25, 1750),
            new THREE.Vector3(-3000, 25, 1800),
            new THREE.Vector3(-2000, 25, 1900),
            new THREE.Vector3(-1000, 25, 2000),
            new THREE.Vector3(0, 25, 2100),
            new THREE.Vector3(1000, 25, 2200),
            new THREE.Vector3(1500, 25, 2250),
            new THREE.Vector3(2000, 25, 2000),
            new THREE.Vector3(2300, 25, 1500),
            new THREE.Vector3(2400, 25, 1000),
            new THREE.Vector3(2500, 25, 0),
            new THREE.Vector3(2000, 25, -1000),
            new THREE.Vector3(1500, 25, -1250),
            new THREE.Vector3(1000, 25, -1200),
            new THREE.Vector3(0, 25, -1100),
            new THREE.Vector3(-1000, 25, -1000),
            new THREE.Vector3(-2000, 25, -900),
            new THREE.Vector3(-3000, 25, -800),
            new THREE.Vector3(-4000, 25, -700),
            new THREE.Vector3(-5000, 25, -1000),
            new THREE.Vector3(-5500, 25, -2000),
            new THREE.Vector3(-5500, 25, -3000),
            new THREE.Vector3(-5500, 25, -4000),
            new THREE.Vector3(-5000, 25, -5000),
            new THREE.Vector3(-4000, 25, -5500),
            new THREE.Vector3(-3000, 25, -5650),
            new THREE.Vector3(-2000, 25, -5700),
            new THREE.Vector3(-1000, 25, -5700),
            new THREE.Vector3(0, 25, -5600),
            new THREE.Vector3(1000, 25, -5500),
            new THREE.Vector3(2000, 25, -5350),
            new THREE.Vector3(3000, 25, -5000),
            new THREE.Vector3(3500, 25, -4500),
            new THREE.Vector3(4000, 25, -3500),
            new THREE.Vector3(4000, 25, -2500),
            new THREE.Vector3(4000, 25, -2000),
            new THREE.Vector3(4000, 25, -1000),
            new THREE.Vector3(4000, 25, 0),
            new THREE.Vector3(4100, 25, 1000),
            new THREE.Vector3(4200, 25, 2000),
            new THREE.Vector3(4300, 25, 3000),
            new THREE.Vector3(4400, 25, 4000),
            new THREE.Vector3(4400, 25, 5000),
            new THREE.Vector3(4000, 25, 6000),
            new THREE.Vector3(3500, 25, 6300),
            new THREE.Vector3(3000, 25, 6400),
            new THREE.Vector3(2000, 25, 6400),
            new THREE.Vector3(1000, 25, 6300),
            new THREE.Vector3(0, 25, 6150),
            new THREE.Vector3(-1000, 25, 6050),
            new THREE.Vector3(-1500, 25, 6000),
            new THREE.Vector3(-2500, 25, 6100),
            new THREE.Vector3(-3500, 25, 6200),
            new THREE.Vector3(-4000, 25, 6000),
            new THREE.Vector3(-4450, 25, 5000),
            new THREE.Vector3(-4500, 25, 4000),
            new THREE.Vector3(-4450, 25, 3000),
            new THREE.Vector3(-4000, 25, 2000),
            new THREE.Vector3(-3500, 25, 1750),
            new THREE.Vector3(-3000, 25, 1800),
            new THREE.Vector3(-2000, 25, 1900),
            new THREE.Vector3(-1000, 25, 2000),
            new THREE.Vector3(0, 25, 2100),
            new THREE.Vector3(1000, 25, 2200),
            new THREE.Vector3(1500, 25, 2250),
            new THREE.Vector3(2000, 25, 2000),
            new THREE.Vector3(2300, 25, 1500),
            new THREE.Vector3(2400, 25, 1000),
            new THREE.Vector3(2500, 25, 0),
            new THREE.Vector3(2000, 25, -1000),
            new THREE.Vector3(1500, 25, -1250),
            new THREE.Vector3(1000, 25, -1200),
            new THREE.Vector3(0, 25, -1100),
            new THREE.Vector3(-1000, 25, -1000),
            new THREE.Vector3(-2000, 25, -900),
            new THREE.Vector3(-3000, 25, -800),
            new THREE.Vector3(-4000, 25, -700),
            new THREE.Vector3(-5000, 25, -1000),
            new THREE.Vector3(-5500, 25, -2000),
            new THREE.Vector3(-5500, 25, -3000),
            new THREE.Vector3(-5500, 25, -4000),
            new THREE.Vector3(-5000, 25, -5000),
            new THREE.Vector3(-4000, 25, -5500),
            new THREE.Vector3(-3000, 25, -5650),
            new THREE.Vector3(-2000, 25, -5700),
            new THREE.Vector3(-1000, 25, -5700),
            new THREE.Vector3(0, 25, -5600),
            new THREE.Vector3(1000, 25, -5500),
            new THREE.Vector3(2000, 25, -5350),
            new THREE.Vector3(3000, 25, -5000),
            new THREE.Vector3(3500, 25, -4500),
            new THREE.Vector3(4000, 25, -3500),
            new THREE.Vector3(4000, 25, -2500),
            new THREE.Vector3(4000, 25, -2000),
            new THREE.Vector3(4000, 25, -1000),
            new THREE.Vector3(4000, 25, 0),
          ];

          this.init();
    }


    init(){

        //this.debugKeyFrames();
        const positionKF = new THREE.VectorKeyframeTrack('.position', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136,
            137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173],
            [
                ...this.keyPoints[0],
                ...this.keyPoints[1],
                ...this.keyPoints[2],
                ...this.keyPoints[3],
                ...this.keyPoints[4],
                ...this.keyPoints[5],
                ...this.keyPoints[6],
                ...this.keyPoints[7],
                ...this.keyPoints[8],
                ...this.keyPoints[9],
                ...this.keyPoints[10],
                ...this.keyPoints[11],
                ...this.keyPoints[12],
                ...this.keyPoints[13],
                ...this.keyPoints[14],
                ...this.keyPoints[15],
                ...this.keyPoints[16],
                ...this.keyPoints[17],
                ...this.keyPoints[18],
                ...this.keyPoints[19],
                ...this.keyPoints[20],
                ...this.keyPoints[21],
                ...this.keyPoints[22],
                ...this.keyPoints[23],
                ...this.keyPoints[24],
                ...this.keyPoints[25],
                ...this.keyPoints[26],
                ...this.keyPoints[27],
                ...this.keyPoints[28],
                ...this.keyPoints[29],
                ...this.keyPoints[30],
                ...this.keyPoints[31],
                ...this.keyPoints[32],
                ...this.keyPoints[33],
                ...this.keyPoints[34],
                ...this.keyPoints[35],
                ...this.keyPoints[36],
                ...this.keyPoints[37],
                ...this.keyPoints[38],
                ...this.keyPoints[39],
                ...this.keyPoints[40],
                ...this.keyPoints[41],
                ...this.keyPoints[42],
                ...this.keyPoints[43],
                ...this.keyPoints[44],
                ...this.keyPoints[45],
                ...this.keyPoints[46],
                ...this.keyPoints[47],
                ...this.keyPoints[48],
                ...this.keyPoints[49],
                ...this.keyPoints[50],
                ...this.keyPoints[51],
                ...this.keyPoints[52],
                ...this.keyPoints[53],
                ...this.keyPoints[54],
                ...this.keyPoints[55],
                ...this.keyPoints[56],
                ...this.keyPoints[57],
                ...this.keyPoints[58],
                ...this.keyPoints[59],
                ...this.keyPoints[60],
                ...this.keyPoints[61],
                ...this.keyPoints[62],
                ...this.keyPoints[63],
                ...this.keyPoints[64],
                ...this.keyPoints[65],
                ...this.keyPoints[66],
                ...this.keyPoints[67],
                ...this.keyPoints[68],
                ...this.keyPoints[69],
                ...this.keyPoints[70],
                ...this.keyPoints[71],
                ...this.keyPoints[72],
                ...this.keyPoints[73],
                ...this.keyPoints[74],
                ...this.keyPoints[75],
                ...this.keyPoints[76],
                ...this.keyPoints[77],
                ...this.keyPoints[78],
                ...this.keyPoints[79],
                ...this.keyPoints[80],
                ...this.keyPoints[81],
                ...this.keyPoints[82],
                ...this.keyPoints[83],
                ...this.keyPoints[84],
                ...this.keyPoints[85],
                ...this.keyPoints[86],
                ...this.keyPoints[87],
                ...this.keyPoints[88],
                ...this.keyPoints[89],
                ...this.keyPoints[90],
                ...this.keyPoints[91],
                ...this.keyPoints[92],
                ...this.keyPoints[93],
                ...this.keyPoints[94],
                ...this.keyPoints[95],
                ...this.keyPoints[96],
                ...this.keyPoints[97],
                ...this.keyPoints[98],
                ...this.keyPoints[99],
                ...this.keyPoints[100],
                ...this.keyPoints[101],
                ...this.keyPoints[102],
                ...this.keyPoints[103],
                ...this.keyPoints[104],
                ...this.keyPoints[105],
                ...this.keyPoints[106],
                ...this.keyPoints[107],
                ...this.keyPoints[108],
                ...this.keyPoints[109],
                ...this.keyPoints[110],
                ...this.keyPoints[111],
                ...this.keyPoints[112],
                ...this.keyPoints[113],
                ...this.keyPoints[114],
                ...this.keyPoints[115],
                ...this.keyPoints[116],
                ...this.keyPoints[117],
                ...this.keyPoints[118],
                ...this.keyPoints[119],
                ...this.keyPoints[120],
                ...this.keyPoints[121],
                ...this.keyPoints[122],
                ...this.keyPoints[123],
                ...this.keyPoints[124],
                ...this.keyPoints[125],
                ...this.keyPoints[126],
                ...this.keyPoints[127],
                ...this.keyPoints[128],
                ...this.keyPoints[129],
                ...this.keyPoints[130],
                ...this.keyPoints[131],
                ...this.keyPoints[132],
                ...this.keyPoints[133],
                ...this.keyPoints[134],
                ...this.keyPoints[135],
                ...this.keyPoints[136],
                ...this.keyPoints[137],
                ...this.keyPoints[138],
                ...this.keyPoints[139],
                ...this.keyPoints[140],
                ...this.keyPoints[141],
                ...this.keyPoints[142],
                ...this.keyPoints[143],
                ...this.keyPoints[144],
                ...this.keyPoints[145],
                ...this.keyPoints[146],
                ...this.keyPoints[147],
                ...this.keyPoints[148],
                ...this.keyPoints[149],
                ...this.keyPoints[150],
                ...this.keyPoints[151],
                ...this.keyPoints[152],
                ...this.keyPoints[153],
                ...this.keyPoints[154],
                ...this.keyPoints[155],
                ...this.keyPoints[156],
                ...this.keyPoints[157],
                ...this.keyPoints[158],
                ...this.keyPoints[159],
                ...this.keyPoints[160],
                ...this.keyPoints[161],
                ...this.keyPoints[162],
                ...this.keyPoints[163],
                ...this.keyPoints[164],
                ...this.keyPoints[165],
                ...this.keyPoints[166],
                ...this.keyPoints[167],
                ...this.keyPoints[168],
                ...this.keyPoints[169],
                ...this.keyPoints[170],
                ...this.keyPoints[171],
                ...this.keyPoints[172],
                ...this.keyPoints[173],
            ],
            THREE.InterpolateSmooth  /* THREE.InterpolateLinear (default), THREE.InterpolateDiscrete,*/
        )

        const yAxis = new THREE.Vector3(0, 1, 0)
        const q1 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(0))
        const q2 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(5))
        const q3 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(5))
        const q4 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(5))
        const q5 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(5))
        const q6 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-10))
        const q7 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-35))
        const q8 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-85))
        const q9 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-75))
        const q10 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-95))
        const q11 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-95))
        const q12 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-95))
        const q13 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-95))
        const q14 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-90))
        const q15 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-85))
        const q16 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-85))
        const q17 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-150))
        const q18 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-170))
        const q19 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-180))
        const q20 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-200))
        const q21 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-220))
        const q22 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-285))
        const q23 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-275))
        const q24 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-265))
        const q25 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-275))
        const q26 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-275))
        const q27 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-275))
        const q28 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-265))
        const q29 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-235))
        const q30 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-205))
        const q31 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-185))
        const q32 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-165))
        const q33 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-135))
        const q34 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-100))
        const q35 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-80))
        const q36 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-85))
        const q37 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-85))
        const q38 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-85))
        const q39 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-85))
        const q40 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-85))
        const q41 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-150))
        const q42 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-180))
        const q43 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-190))
        const q44 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-190))
        const q45 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-200))
        const q46 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-260))
        const q47 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-280))
        const q48 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-275))
        const q49 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-275))
        const q50 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-275))
        const q51 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-275))
        const q52 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-275))
        const q53 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(-285))
        const q54 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(0))
        const q55 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(0))
        const q56 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(0))
        const q57 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(0))
        const q58 = new THREE.Quaternion().setFromAxisAngle(yAxis, THREE.MathUtils.degToRad(0))


        const quaternionKF = new THREE.QuaternionKeyframeTrack('.quaternion', [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 91, 92, 93, 94, 95, 96, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 123, 124, 125, 126, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136,
            137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173],
            [q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w,
            q4.x, q4.y, q4.z, q4.w,
            q5.x, q5.y, q5.z, q5.w,
            q6.x, q6.y, q6.z, q6.w,
            q7.x, q7.y, q7.z, q7.w,
            q8.x, q8.y, q8.z, q8.w,
            q9.x, q9.y, q9.z, q9.w,
            q10.x, q10.y, q10.z, q10.w,
            q11.x, q11.y, q11.z, q11.w,
            q12.x, q12.y, q12.z, q12.w,
            q13.x, q13.y, q13.z, q13.w,
            q14.x, q14.y, q14.z, q14.w,
            q15.x, q15.y, q15.z, q15.w,
            q16.x, q16.y, q16.z, q16.w,
            q17.x, q17.y, q17.z, q17.w,
            q18.x, q18.y, q18.z, q18.w,
            q19.x, q19.y, q19.z, q19.w,
            q20.x, q20.y, q20.z, q20.w,
            q21.x, q21.y, q21.z, q21.w,
            q22.x, q22.y, q22.z, q22.w,
            q23.x, q23.y, q23.z, q23.w,
            q24.x, q24.y, q24.z, q24.w,
            q25.x, q25.y, q25.z, q25.w,
            q26.x, q26.y, q26.z, q26.w,
            q27.x, q27.y, q27.z, q27.w,
            q28.x, q28.y, q28.z, q28.w,
            q29.x, q29.y, q29.z, q29.w,
            q30.x, q30.y, q30.z, q30.w,
            q31.x, q31.y, q31.z, q31.w,
            q32.x, q32.y, q32.z, q32.w,
            q33.x, q33.y, q33.z, q33.w,
            q34.x, q34.y, q34.z, q34.w,
            q35.x, q35.y, q35.z, q35.w,
            q36.x, q36.y, q36.z, q36.w,
            q37.x, q37.y, q37.z, q37.w,
            q38.x, q38.y, q38.z, q38.w,
            q39.x, q39.y, q39.z, q39.w,
            q40.x, q40.y, q40.z, q40.w,
            q41.x, q41.y, q41.z, q41.w,
            q42.x, q42.y, q42.z, q42.w,
            q43.x, q43.y, q43.z, q43.w,
            q44.x, q44.y, q44.z, q44.w,
            q45.x, q45.y, q45.z, q45.w,
            q46.x, q46.y, q46.z, q46.w,
            q47.x, q47.y, q47.z, q47.w,
            q48.x, q48.y, q48.z, q48.w,
            q49.x, q49.y, q49.z, q49.w,
            q50.x, q50.y, q50.z, q50.w,
            q51.x, q51.y, q51.z, q51.w,
            q52.x, q52.y, q52.z, q52.w,
            q53.x, q53.y, q53.z, q53.w,
            q54.x, q54.y, q54.z, q54.w,
            q55.x, q55.y, q55.z, q55.w,
            q56.x, q56.y, q56.z, q56.w,
            q57.x, q57.y, q57.z, q57.w,
            q58.x, q58.y, q58.z, q58.w,
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w,
            q4.x, q4.y, q4.z, q4.w,
            q5.x, q5.y, q5.z, q5.w,
            q6.x, q6.y, q6.z, q6.w,
            q7.x, q7.y, q7.z, q7.w,
            q8.x, q8.y, q8.z, q8.w,
            q9.x, q9.y, q9.z, q9.w,
            q10.x, q10.y, q10.z, q10.w,
            q11.x, q11.y, q11.z, q11.w,
            q12.x, q12.y, q12.z, q12.w,
            q13.x, q13.y, q13.z, q13.w,
            q14.x, q14.y, q14.z, q14.w,
            q15.x, q15.y, q15.z, q15.w,
            q16.x, q16.y, q16.z, q16.w,
            q17.x, q17.y, q17.z, q17.w,
            q18.x, q18.y, q18.z, q18.w,
            q19.x, q19.y, q19.z, q19.w,
            q20.x, q20.y, q20.z, q20.w,
            q21.x, q21.y, q21.z, q21.w,
            q22.x, q22.y, q22.z, q22.w,
            q23.x, q23.y, q23.z, q23.w,
            q24.x, q24.y, q24.z, q24.w,
            q25.x, q25.y, q25.z, q25.w,
            q26.x, q26.y, q26.z, q26.w,
            q27.x, q27.y, q27.z, q27.w,
            q28.x, q28.y, q28.z, q28.w,
            q29.x, q29.y, q29.z, q29.w,
            q30.x, q30.y, q30.z, q30.w,
            q31.x, q31.y, q31.z, q31.w,
            q32.x, q32.y, q32.z, q32.w,
            q33.x, q33.y, q33.z, q33.w,
            q34.x, q34.y, q34.z, q34.w,
            q35.x, q35.y, q35.z, q35.w,
            q36.x, q36.y, q36.z, q36.w,
            q37.x, q37.y, q37.z, q37.w,
            q38.x, q38.y, q38.z, q38.w,
            q39.x, q39.y, q39.z, q39.w,
            q40.x, q40.y, q40.z, q40.w,
            q41.x, q41.y, q41.z, q41.w,
            q42.x, q42.y, q42.z, q42.w,
            q43.x, q43.y, q43.z, q43.w,
            q44.x, q44.y, q44.z, q44.w,
            q45.x, q45.y, q45.z, q45.w,
            q46.x, q46.y, q46.z, q46.w,
            q47.x, q47.y, q47.z, q47.w,
            q48.x, q48.y, q48.z, q48.w,
            q49.x, q49.y, q49.z, q49.w,
            q50.x, q50.y, q50.z, q50.w,
            q51.x, q51.y, q51.z, q51.w,
            q52.x, q52.y, q52.z, q52.w,
            q53.x, q53.y, q53.z, q53.w,
            q54.x, q54.y, q54.z, q54.w,
            q55.x, q55.y, q55.z, q55.w,
            q56.x, q56.y, q56.z, q56.w,
            q57.x, q57.y, q57.z, q57.w,
            q58.x, q58.y, q58.z, q58.w,
            q1.x, q1.y, q1.z, q1.w,
            q2.x, q2.y, q2.z, q2.w,
            q3.x, q3.y, q3.z, q3.w,
            q4.x, q4.y, q4.z, q4.w,
            q5.x, q5.y, q5.z, q5.w,
            q6.x, q6.y, q6.z, q6.w,
            q7.x, q7.y, q7.z, q7.w,
            q8.x, q8.y, q8.z, q8.w,
            q9.x, q9.y, q9.z, q9.w,
            q10.x, q10.y, q10.z, q10.w,
            q11.x, q11.y, q11.z, q11.w,
            q12.x, q12.y, q12.z, q12.w,
            q13.x, q13.y, q13.z, q13.w,
            q14.x, q14.y, q14.z, q14.w,
            q15.x, q15.y, q15.z, q15.w,
            q16.x, q16.y, q16.z, q16.w,
            q17.x, q17.y, q17.z, q17.w,
            q18.x, q18.y, q18.z, q18.w,
            q19.x, q19.y, q19.z, q19.w,
            q20.x, q20.y, q20.z, q20.w,
            q21.x, q21.y, q21.z, q21.w,
            q22.x, q22.y, q22.z, q22.w,
            q23.x, q23.y, q23.z, q23.w,
            q24.x, q24.y, q24.z, q24.w,
            q25.x, q25.y, q25.z, q25.w,
            q26.x, q26.y, q26.z, q26.w,
            q27.x, q27.y, q27.z, q27.w,
            q28.x, q28.y, q28.z, q28.w,
            q29.x, q29.y, q29.z, q29.w,
            q30.x, q30.y, q30.z, q30.w,
            q31.x, q31.y, q31.z, q31.w,
            q32.x, q32.y, q32.z, q32.w,
            q33.x, q33.y, q33.z, q33.w,
            q34.x, q34.y, q34.z, q34.w,
            q35.x, q35.y, q35.z, q35.w,
            q36.x, q36.y, q36.z, q36.w,
            q37.x, q37.y, q37.z, q37.w,
            q38.x, q38.y, q38.z, q38.w,
            q39.x, q39.y, q39.z, q39.w,
            q40.x, q40.y, q40.z, q40.w,
            q41.x, q41.y, q41.z, q41.w,
            q42.x, q42.y, q42.z, q42.w,
            q43.x, q43.y, q43.z, q43.w,
            q44.x, q44.y, q44.z, q44.w,
            q45.x, q45.y, q45.z, q45.w,
            q46.x, q46.y, q46.z, q46.w,
            q47.x, q47.y, q47.z, q47.w,
            q48.x, q48.y, q48.z, q48.w,
            q49.x, q49.y, q49.z, q49.w,
            q50.x, q50.y, q50.z, q50.w,
            q51.x, q51.y, q51.z, q51.w,
            q52.x, q52.y, q52.z, q52.w,
            q53.x, q53.y, q53.z, q53.w,
            q54.x, q54.y, q54.z, q54.w,
            q55.x, q55.y, q55.z, q55.w,
            q56.x, q56.y, q56.z, q56.w,
            q57.x, q57.y, q57.z, q57.w,
            q58.x, q58.y, q58.z, q58.w,
        ]
        );


        const positionClip = new THREE.AnimationClip('positionAnimation', this.animationMaxDuration, [positionKF])
        const rotationClip = new THREE.AnimationClip('rotationAnimation', this.animationMaxDuration, [quaternionKF])
        console.log("rotationClip", quaternionKF)

        console.log("positionClip", positionClip)
        // Create an AnimationMixer
        this.mixer = new THREE.AnimationMixer(this.model)

        // Create AnimationActions for each clip
        const positionAction = this.mixer.clipAction(positionClip)
        const rotationAction = this.mixer.clipAction(rotationClip)

        // Play both animations
        positionAction.play()
        rotationAction.play()

    }

    /**
     * Set a specific point in the animation clip
     */
        setMixerTime() {
            this.mixer.setTime(this.mixerTime)
        }


    debugKeyFrames(){
        let spline = new THREE.CatmullRomCurve3([...this.keyPoints]);

        // Setup visual control points

        for (let i = 0; i < this.keyPoints.length; i++) {
            const geometry = new THREE.SphereGeometry(20, 32, 32)
            const material = new THREE.MeshBasicMaterial({ color: 0x0000ff })
            const sphere = new THREE.Mesh(geometry, material)
            sphere.position.set(... this.keyPoints[i])
            this.app.scene.add(sphere)
        }


        const tubeGeometry = new THREE.TubeGeometry(spline, 200, 10, 10, false)
        const tubeMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 })
        const tubeMesh = new THREE.Mesh(tubeGeometry, tubeMaterial)
        this.app.scene.add(tubeMesh);

    }




    /**
     * Start/Stop all animations
     */
    checkAnimationStateIsPause() {
        if (this.mixerPause) {
            this.mixer.timeScale = 0
        }
        else {
            this.mixer.timeScale = 1
        }
    }

    /**
     * Start/Stop if position or rotation animation track is running
     */
    checkTracksEnabled() {

        const actions = this.mixer._actions
        for (let i = 0; i < actions.length; i++) {
            const track = actions[i]._clip.tracks[0]

            if (track.name === '.position' && this.enableAnimationPosition === false) {
                actions[i].stop()
            }
            else {
                if (!actions[i].isRunning())
                    actions[i].play()
            }
        }
    }


    update() {
        const currentCarAngle = this.model.rotation.y;
        const delta = this.clock.getDelta()
        this.mixer.update(delta * (this.acceleration / 10))
        this.counter += 1;
        const nextCarAngle = this.model.rotation.y;
        if(this.counter >= 25){
            this.wheelController = new WheelController(delta, this.model, this.wheels, currentCarAngle, nextCarAngle);
            this.wheelController.update();
        }

        this.checkAnimationStateIsPause()
        this.checkTracksEnabled()
    }
}

export { AutomaticCarController };
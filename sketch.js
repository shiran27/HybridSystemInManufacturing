/*
// Dedicated to all the victims of Easter Bombings - Sri Lanka 
// 21 April 2019
*/

var canvas;
var width;
var height;


function setup() {
  	
  	pixelDensity(1);
    const canvasHolder = select('#canvasHolder');
    width  = canvasHolder.width;
    height = canvasHolder.height;
    canvas = createCanvas(width, height);
    canvas.parent('canvasHolder');

    Math.seedrandom('27');
    initialDataReadFromInterface()

    frameRate(1/timeResolution);

    consolePrint("User interface loaded.");
    


}

function draw() {
	

	background(225);
    strokeWeight(4);
    noFill();
    stroke(0);
    rect(0,0,width,height);



    updateInterface();


    

    

}



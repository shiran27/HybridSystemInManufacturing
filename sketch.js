/*
// Dedicated to all the victims of Easter Bombings - Sri Lanka 
// 21 April 2019
*/

var canvas;
var width;
var height;


var maximumQuality; 
var serverRadius;

function setup() {
  	
  	pixelDensity(1);
    const canvasHolder = select('#canvasHolder');
    width  = canvasHolder.width;
    height = canvasHolder.height;
    canvas = createCanvas(width, height);
    canvas.parent('canvasHolder');

    Math.seedrandom('27');
    initialDataReadFromInterface()

    plotData();

    serverRadius = 50;
    frameRate(1/timeResolution);


    consolePrint("User interface loaded.");
    


}

function draw() {
	

	background(225);
    strokeWeight(4);
    noFill();
    stroke(0);
    rect(0,0,width,height);


    drawQueueingSystem();

    if(simulationMode==1){

        simulations[selectedSimulationIndex].update();
        simulationTime = simulationTime + timeResolution;

    }else{
        for(var i = 0 ; i<entities.length; i++){
            entities[i].show();
        }
    }

    

    

}


function drawQueueingSystem(){
    
    //fill(255,0,0);
    stroke(2);
    circle(300,150,serverRadius*2);

    line(300-serverRadius-10,150,300-serverRadius,150);
    line(300-serverRadius-10,120,300-serverRadius-10,180);
    
    line(300-serverRadius-10,120,300-serverRadius-200,120);
    line(300-serverRadius-10,180,300-serverRadius-200,180);
    for(var i = 1; i<10 ; i++){
        line(300-serverRadius-10-i*20,120,300-serverRadius-10-i*20,180);
    }
}


function runSimulation(){
    selectedSimulationIndex = Number(document.getElementById("realizationSelectDropDown").value);
    
    maximumQuality = simulations[selectedSimulationIndex].getMaximumQuality();
    print("max Quality = "+maximumQuality)
    simulationTime = 0;
    simulationMode = 1;

    entities = [];

}

function resetSimulation(){
    
    consolePrint("Simulation Resetted !");
    simulationTime = 0;
    simulationMode = 0;

    entities = [];
    updateStaticPlots();

}

function pauseSimulation(){
    consolePrint("Pause Real-Time Simulation !");

    simulationMode = 0;
    
    

}


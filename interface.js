var numberOfArrivals;

var arrivalTimesArray;

var departureTimePanaltyAlpha; 
var controlInputPanaltyBeta; 
var waitingTimePanaltyGamma; 

var timeResolution;



var simulationMode = 0;
var queueLengthPlotMode = true;

eventTimeArray = [0,1,1.5,2.3,6,10,15.2];
queueLengthArray = [0,1,2,3,4,5,4];

function updateInterface(){
    plotData();

}

function initialDataReadFromInterface(){

	numberOfArrivals = Number(document.getElementById("numberOfArrivals").value);
	departureTimePanaltyAlpha = Number(document.getElementById("departureTimePanalty").value);
	controlInputPanaltyBeta = Number(document.getElementById("controlInputPanalty").value); 
	waitingPanaltyGamma = Number(document.getElementById("waitingTimePanalty").value); 
	timeResolution = Number(document.getElementById("timeResolution").value); 
	
	generateArrivalTimes();
	//generateQualityLevels();
	//solveForCOntrolInputs();
	

}


function generateArrivalTimes(){

	numberOfArrivals = Number(document.getElementById("numberOfArrivals").value);
	arrivalTimesArray = [];
	
	var arrivalTimesGenerationMethod = Number(document.getElementById("arrivalsGenerationMethodDropdown").value);
	
	if(arrivalTimesGenerationMethod==0){// deterministic
		
		// reading menu
		document.getElementById("arrivalsGenerationParameter1Label").innerHTML = "Interval: ";
		var timeInterval = Number(document.getElementById("arrivalsGenerationParameter1").value);

		document.getElementById("arrivalsGenerationParameter2Label").innerHTML = "-";
		document.getElementById("arrivalsGenerationParameter2").disabled = "true";

		// generating values
		var dummyTime = 0;
		for(var i = 0; i<numberOfArrivals; i++){
			dummyTime = dummyTime+timeInterval;
			arrivalTimesArray.push(dummyTime);
		}


	}else if(arrivalTimesGenerationMethod==1){// uniformly random

		// reading menu
		document.getElementById("arrivalsGenerationParameter1Label").innerHTML = "Interval (min):";
		var timeIntervalMin = Number(document.getElementById("arrivalsGenerationParameter1").value);
		

		document.getElementById("arrivalsGenerationParameter2Label").innerHTML = "Interval (max):";
		//document.getElementById("arrivalsGenerationParameter2").disabled = "false";
		var timeIntervalMax = Number(document.getElementById("arrivalsGenerationParameter2").value);

		// generating values
		var dummyTime = 0;
		for(var i = 0; i<numberOfArrivals; i++){
			var timeInterval = Math.random()*(timeIntervalMax - timeIntervalMin) + timeIntervalMin;
			dummyTime = dummyTime+timeInterval;
			arrivalTimesArray.push(dummyTime);
		}

	}else if(arrivalTimesGenerationMethod==2){// poisson

		// reading menu
		document.getElementById("arrivalsGenerationParameter1Label").innerHTML = "Interval (Mean):";
		var meanInterArrivalTime = Number(document.getElementById("arrivalsGenerationParameter1").value);
		

		document.getElementById("arrivalsGenerationParameter2Label").innerHTML = "-";
		document.getElementById("arrivalsGenerationParameter2").disabled = "false";
		//var timeIntervalMax = Number(document.getElementById("arrivalsGenerationParameter2").value);

		// generating values
		var dummyTime = 0;
		for(var i = 0; i<numberOfArrivals; i++){
			var timeInterval = -1*Math.log(1-Math.random())*meanInterArrivalTime;
			dummyTime = dummyTime+timeInterval;
			arrivalTimesArray.push(dummyTime);
		}

	}else{
		//custom
	}

	// displaying values
	createTable("arrivalTimesTable",arrivalTimesArray);



	
}


function createTable(tableName,valueArray){
	var tableLength = valueArray.length;
	var maxRowLength = 15;
	var numOfRows = Math.ceil(tableLength/maxRowLength);

	document.getElementById(tableName).innerHTML = "";
	HTMLTag = "";

	var i = 0;
	for(j = 0; j<numOfRows; j++){

		HTMLTag += "<tr>";
		for(var k = 0; k<maxRowLength; k++){
			i++;
			if(i<=tableLength){
				HTMLTag += "<td contenteditable='true' id='"+tableName+"Cell"+i+"'>"+valueArray[i-1].toFixed(1)+"</td>";
			}else{
				HTMLTag += "<td contenteditable='true' id='"+tableName+"Cell"+(i+1)+"'></td>";
			}
		}
		HTMLTag += "</tr>";

	}
	document.getElementById(tableName).innerHTML = HTMLTag;
						          
}


function consolePrint(consoleText){
    document.getElementById("consoleText").innerHTML += ">> "+consoleText+"<br>";
    document.getElementById("consoleText").scrollTop = document.getElementById("consoleText").scrollHeight;
}
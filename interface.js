var numberOfArrivals;

var arrivalTimesArray;
var qualityLevelsArray;
var controlInputArray;

var departureTimePanaltyAlpha; 
var controlInputPanaltyBeta; 
var waitingTimePanaltyGamma; 

var timeResolution;
var simulationTime = 0;
var frameRate = 1;
var entities = [];
var selectedSimulationID = 0;
var simulationMode = 0;




var queueLengthPlotMode = true;

var eventTimeArray = [];
// var eventTimeArray = [0,1,1.5,2.3,6,10,15.2];
// var queueLengthArray = [0,1,2,3,4,5,4];
var queueLengthArray = [];

var simulations = [];
var tempSimulation;


function initialDataReadFromInterface(){

	numberOfArrivals = Number(document.getElementById("numberOfArrivals").value);
	departureTimePanaltyAlpha = Number(document.getElementById("departureTimePanalty").value);
	controlInputPanaltyBeta = Number(document.getElementById("controlInputPanalty").value); 
	waitingTimePanaltyGamma = Number(document.getElementById("waitingTimePanalty").value); 
	timeResolution = Number(document.getElementById("timeResolution").value); 
	
	generateArrivalTimes();
	generateQualityLevels();

	controlGenerationMethodDropdownChanged();
	
}


function generateArrivalTimes(){

	numberOfArrivals = Number(document.getElementById("numberOfArrivals").value);
	var newArrivalTimesArray = [];
	
	var arrivalTimesGenerationMethod = Number(document.getElementById("arrivalsGenerationMethodDropdown").value);
	
	if(arrivalTimesGenerationMethod==0){// deterministic
		
		// reading menu
		if(document.getElementById("arrivalsGenerationParameter1").disabled){document.getElementById("arrivalsGenerationParameter1").value = "1";}
		document.getElementById("arrivalsGenerationParameter1").disabled = false;
		document.getElementById("arrivalsGenerationParameter1Label").innerHTML = "Interval: ";
		var timeInterval = Number(document.getElementById("arrivalsGenerationParameter1").value);

		document.getElementById("arrivalsGenerationParameter2").disabled = true;
		document.getElementById("arrivalsGenerationParameter2Label").innerHTML = "-";
		document.getElementById("arrivalsGenerationParameter2").value = "";

		// generating values
		var dummyTime = 0;
		for(var i = 0; i<numberOfArrivals; i++){
			dummyTime = dummyTime+timeInterval;
			newArrivalTimesArray.push(dummyTime);
		}


	}else if(arrivalTimesGenerationMethod==1){// uniformly random

		// reading menu
		if(document.getElementById("arrivalsGenerationParameter1").disabled){document.getElementById("arrivalsGenerationParameter1").value = "1";}
		document.getElementById("arrivalsGenerationParameter1").disabled = false;
		document.getElementById("arrivalsGenerationParameter1Label").innerHTML = "Interval (min):";
		var timeIntervalMin = Number(document.getElementById("arrivalsGenerationParameter1").value);
		

		if(document.getElementById("arrivalsGenerationParameter2").disabled){document.getElementById("arrivalsGenerationParameter2").value = "5";}
		document.getElementById("arrivalsGenerationParameter2").disabled = false;
		document.getElementById("arrivalsGenerationParameter2Label").innerHTML = "Interval (max):";
		var timeIntervalMax = Number(document.getElementById("arrivalsGenerationParameter2").value);

		// generating values
		var dummyTime = 0;
		for(var i = 0; i<numberOfArrivals; i++){
			var timeInterval = Math.random()*(timeIntervalMax - timeIntervalMin) + timeIntervalMin;
			dummyTime = dummyTime+timeInterval;
			newArrivalTimesArray.push(dummyTime);
		}

	}else if(arrivalTimesGenerationMethod==2){// poisson

		// reading menu
		if(document.getElementById("arrivalsGenerationParameter1").disabled){document.getElementById("arrivalsGenerationParameter1").value = "1";}
		document.getElementById("arrivalsGenerationParameter1").disabled = false;
		document.getElementById("arrivalsGenerationParameter1Label").innerHTML = "Avg. Interval:";
		var meanInterArrivalTime = Number(document.getElementById("arrivalsGenerationParameter1").value);
		
		document.getElementById("arrivalsGenerationParameter2").disabled = true;
		document.getElementById("arrivalsGenerationParameter2Label").innerHTML = "-";
		document.getElementById("arrivalsGenerationParameter2").value = "";
		//var timeIntervalMax = Number(document.getElementById("arrivalsGenerationParameter2").value);

		// generating values
		var dummyTime = 0;
		for(var i = 0; i<numberOfArrivals; i++){
			var timeInterval = -1*Math.log(1-Math.random())*meanInterArrivalTime;
			dummyTime = dummyTime+timeInterval;
			newArrivalTimesArray.push(dummyTime);
		}

	}else{
		//custom
		document.getElementById("arrivalsGenerationParameter1").disabled = true;
		document.getElementById("arrivalsGenerationParameter1Label").innerHTML = "-";
		document.getElementById("arrivalsGenerationParameter1").value = "";

		document.getElementById("arrivalsGenerationParameter2").disabled = true;
		document.getElementById("arrivalsGenerationParameter2Label").innerHTML = "-";
		document.getElementById("arrivalsGenerationParameter2").value = "";


		if(arrivalTimesArray.length==numberOfArrivals){
			newArrivalTimesArray = arrivalTimesArray;
			consolePrint("Enter the arrival time values in the table and click 'Update'.");
		}else{
			for(var i = 0; i<numberOfArrivals; i++){
				newArrivalTimesArray.push(i+1);
			}
			consolePrint("Loading current arrival time values in table, if needed, edit the table and click 'Update'.");
		}
		
	}

	arrivalTimesArray = newArrivalTimesArray;
	// displaying values
	createTable("arrivalTimesTable",arrivalTimesArray);

	
}


function generateQualityLevels(){

	numberOfArrivals = Number(document.getElementById("numberOfArrivals").value);
	var newQualityLevelsArray = [];
	
	var qualityLevelsGenerationMethod = Number(document.getElementById("qualityGenerationMethodDropdown").value);
	
	if(qualityLevelsGenerationMethod==0){// deterministic
		
		// reading menu
		// reading menu
		if(document.getElementById("qualityGenerationParameter1").disabled){document.getElementById("qualityGenerationParameter1").value = "1";}		
		document.getElementById("qualityGenerationParameter1").disabled = false;
		document.getElementById("qualityGenerationParameter1Label").innerHTML = "Value: ";
		var qualityLevel = Number(document.getElementById("qualityGenerationParameter1").value);

		document.getElementById("qualityGenerationParameter2").disabled = true;
		document.getElementById("qualityGenerationParameter2Label").innerHTML = "-";
		document.getElementById("qualityGenerationParameter2").value = "";
		

		// generating values
		for(var i = 0; i<numberOfArrivals; i++){
			newQualityLevelsArray.push(qualityLevel);
		}


	}else if(qualityLevelsGenerationMethod==1){// uniformly random

		// reading menu
		if(document.getElementById("qualityGenerationParameter1").disabled){document.getElementById("qualityGenerationParameter1").value = "1";}
		document.getElementById("qualityGenerationParameter1").disabled = false;
		document.getElementById("qualityGenerationParameter1Label").innerHTML = "Interval (min):";
		var qualityLevelMin = Number(document.getElementById("qualityGenerationParameter1").value);
		
		if(document.getElementById("qualityGenerationParameter2").disabled){document.getElementById("qualityGenerationParameter2").value = "5";}
		document.getElementById("qualityGenerationParameter2").disabled = false;
		document.getElementById("qualityGenerationParameter2Label").innerHTML = "Interval (max):";
		var qualityLevelMax = Number(document.getElementById("qualityGenerationParameter2").value);

		// generating values
		for(var i = 0; i<numberOfArrivals; i++){
			var qualityLevel = Math.random()*(qualityLevelMax - qualityLevelMin) + qualityLevelMin;
			newQualityLevelsArray.push(qualityLevel);
		}

	}else{
		//custom
		document.getElementById("qualityGenerationParameter1").disabled = true;
		document.getElementById("qualityGenerationParameter1Label").innerHTML = "-";
		document.getElementById("qualityGenerationParameter1").value = "";

		document.getElementById("qualityGenerationParameter2").disabled = true;
		document.getElementById("qualityGenerationParameter2Label").innerHTML = "-";
		document.getElementById("qualityGenerationParameter2").value = "";


		if(qualityLevelsArray.length==numberOfArrivals){
			newQualityLevelsArray = qualityLevelsArray;
			consolePrint("Enter the required quality level values in the table and click 'Update'.");
		}else{
			for(var i = 0; i<numberOfArrivals; i++){
				newQualityLevelsArray.push(i+1);
			}
			consolePrint("Loading current required quality level values in table, if needed, edit the table and click 'Update'.");
		}
		
	}


	qualityLevelsArray = newQualityLevelsArray;
	// displaying values
	createTable("requiredQualityTable",qualityLevelsArray);

	
}




	



function controlGenerationMethodDropdownChanged(){

	// number of arrivals, arrival time values, quality values and panelty parameters are known!

	var newControlInputArray = [];
	
	var controlInputGenerationMethod = Number(document.getElementById("controlGenerationMethodDropdown").value);
	
	if(controlInputGenerationMethod==1){// deterministic
		
		// reading menu
		if(document.getElementById("controlGenerationParameter1").disabled){document.getElementById("controlGenerationParameter1").value = "1";}
		document.getElementById("controlGenerationParameter1").disabled = false;
		document.getElementById("controlGenerationParameter1Label").innerHTML = "Magnitude: ";
		var controlMagnitude = Number(document.getElementById("controlGenerationParameter1").value);

		document.getElementById("controlGenerationParameter2").disabled = true;
		document.getElementById("controlGenerationParameter2Label").innerHTML = "-";
		document.getElementById("controlGenerationParameter2").value = "";

		document.getElementById("controlInputgenerationButtonName").innerHTML = "<i class='fa fa-refresh'></i> Control Inputs";

		// generating values
		for(var i = 0; i<numberOfArrivals; i++){
			newControlInputArray.push(controlMagnitude);
		}


	}else if(controlInputGenerationMethod==2){// uniformly random

		// reading menu
		if(document.getElementById("controlGenerationParameter1").disabled){document.getElementById("controlGenerationParameter1").value = "1";}
		document.getElementById("controlGenerationParameter1").disabled = false;
		document.getElementById("controlGenerationParameter1Label").innerHTML = "Magnitude (min):";
		var magnitudeMin = Number(document.getElementById("controlGenerationParameter1").value);
		

		if(document.getElementById("controlGenerationParameter2").disabled){document.getElementById("controlGenerationParameter2").value = "5";}
		document.getElementById("controlGenerationParameter2").disabled = false;
		document.getElementById("controlGenerationParameter2Label").innerHTML = "Magnitude (max):";
		var magnitudeMax = Number(document.getElementById("controlGenerationParameter2").value);


		document.getElementById("controlInputgenerationButtonName").innerHTML = "<i class='fa fa-refresh'></i> Control Inputs";

		// generating values
		for(var i = 0; i<numberOfArrivals; i++){
			var magnitude = Math.random()*(magnitudeMax - magnitudeMin) + magnitudeMin;
			newControlInputArray.push(magnitude);
		}

	}else if(controlInputGenerationMethod==3){ // custom

		document.getElementById("controlGenerationParameter1").disabled = true;
		document.getElementById("controlGenerationParameter1Label").innerHTML = "-";
		document.getElementById("controlGenerationParameter1").value = "";

		document.getElementById("controlGenerationParameter2").disabled = true;
		document.getElementById("controlGenerationParameter2Label").innerHTML = "-";
		document.getElementById("controlGenerationParameter2").value = "";

		document.getElementById("controlInputgenerationButtonName").innerHTML = "<i class='fa fa-refresh'></i> Control Inputs";

		if(controlInputArray.length==numberOfArrivals){
			newControlInputArray = controlInputArray;
			consolePrint("Enter the control input values in the table and click 'Update'.");
		}else{
			for(var i = 0; i<numberOfArrivals; i++){
				newControlInputArray.push(i+1);
			}
			consolePrint("Loading current control input values in table, if needed, edit the table and click 'Update'.");
		}


	}else{ // need to solve !!!!!!
		
		// reading menu
		if(document.getElementById("controlGenerationParameter1").disabled){document.getElementById("controlGenerationParameter1").value = "1";}
		document.getElementById("controlGenerationParameter1").disabled = false;
		document.getElementById("controlGenerationParameter1Label").innerHTML = "Avg. Interval:";
		var meanInterArrivalTime = Number(document.getElementById("controlGenerationParameter1").value);
		
		document.getElementById("controlGenerationParameter2").disabled = true;
		document.getElementById("controlGenerationParameter2Label").innerHTML = "-";
		document.getElementById("controlGenerationParameter2").value = "";
		//var timeIntervalMax = Number(document.getElementById("controlGenerationParameter2").value);

		document.getElementById("controlInputgenerationButtonName").innerHTML = "Compute Control Inputs";

		newControlInputArray = solveForControlInputs();
		
	}

	controlInputArray = newControlInputArray;
	// displaying values
	createTable("controlInputTable",controlInputArray);


	tempSimulation = new Simulation(numberOfArrivals,arrivalTimesArray,qualityLevelsArray,departureTimePanaltyAlpha,controlInputPanaltyBeta,waitingTimePanaltyGamma,controlInputArray);
	var jVal = tempSimulation.evaluateObjectiveFunction();
	consolePrint("Objective function value achieved by the selected control inpits: J = " + jVal.toFixed(3));
	////document.getElementById('objectiveFunctionValue').disabled = false;
	document.getElementById('objectiveFunctionValue').value = jVal.toFixed(3);



	
}









function createTable(tableName,valueArray){

	var tableLength = valueArray.length;
	var maxRowLength = 15;
	var numOfRows = Math.ceil(tableLength/maxRowLength);

	document.getElementById(tableName).innerHTML = "";
	HTMLTag = "<tbody style='display: block; border: 1px solid green; height: 100px; overflow-y: scroll'>";

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
	document.getElementById(tableName).innerHTML = HTMLTag+"</tbody>";
						          
}


function readTable(tableName){

	numberOfArrivals = Number(document.getElementById("numberOfArrivals").value);

	result = [];
	
	for(var i =0; i<numberOfArrivals; i++){
		result.push(Number(document.getElementById(tableName+"Cell"+(i+1)).innerHTML));
	}
	print("Table read: "+ result);
	return result

}


function updateArrivalTimes(){

	arrivalTimesArray = readTable("arrivalTimesTable");


	document.getElementById("arrivalsGenerationMethodDropdown").value = 3;

	document.getElementById("arrivalsGenerationParameter1").disabled = true;
	document.getElementById("arrivalsGenerationParameter1Label").innerHTML = "-";
	document.getElementById("arrivalsGenerationParameter1").value = "";

	document.getElementById("arrivalsGenerationParameter2").disabled = true;
	document.getElementById("arrivalsGenerationParameter2Label").innerHTML = "-";
	document.getElementById("arrivalsGenerationParameter2").value = "";


	consolePrint("New arrival time values were loaded.")

}


function updateQualityLevels(){

	qualityLevelsArray = readTable("requiredQualityTable");


	document.getElementById("qualityGenerationMethodDropdown").value = 2;

	document.getElementById("qualityGenerationParameter1").disabled = true;
	document.getElementById("qualityGenerationParameter1Label").innerHTML = "-";
	document.getElementById("qualityGenerationParameter1").value = "";

	document.getElementById("qualityGenerationParameter2").disabled = true;
	document.getElementById("qualityGenerationParameter2Label").innerHTML = "-";
	document.getElementById("qualityGenerationParameter2").value = "";


	consolePrint("New required quality levels were loaded.")

}


function updateControlInputs(){

	controlInputArray = readTable("controlInputTable");


	document.getElementById("controlGenerationMethodDropdown").value = 3;

	document.getElementById("controlGenerationParameter1").disabled = true;
	document.getElementById("controlGenerationParameter1Label").innerHTML = "-";
	document.getElementById("controlGenerationParameter1").value = "";

	document.getElementById("controlGenerationParameter2").disabled = true;
	document.getElementById("controlGenerationParameter2Label").innerHTML = "-";
	document.getElementById("controlGenerationParameter2").value = "";


	consolePrint("New control input values were loaded.")

}





function addRealization(){

	var newSimulation = new Simulation(numberOfArrivals,arrivalTimesArray,qualityLevelsArray,departureTimePanaltyAlpha,controlInputPanaltyBeta,waitingTimePanaltyGamma,controlInputArray);
	simulations.push(newSimulation);
	document.getElementById("currentObjectiveFunctionValue").value= newSimulation.objectiveFunctionValue.toFixed(3);

	document.getElementById("realizationSelectDropDown").innerHTML += "<option selected value='"+newSimulation.id+"'>Simulation "+(newSimulation.id+1)+" (cost "+newSimulation.objectiveFunctionValue.toFixed(0)+")</option>";
	consolePrint("Obtained simulation results and the parameters were added as a realization!");

	updateStaticPlots();
}

function removeRealization(){

	var selectedSimulationID = document.getElementById("realizationSelectDropDown").value;
	simulations.splice(selectedSimulationID,1);

	document.getElementById("realizationSelectDropDown").innerHTML = "";
	for(var i = 0; i<simulations.length; i++){
		simulations[i].id = i;
		document.getElementById("realizationSelectDropDown").innerHTML += "<option value='"+i+"'>Simulation "+(i+1)+" (cost "+simulations[i].objectiveFunctionValue.toFixed(0)+")</option>";
	}

		
	document.getElementById("realizationSelectDropDown").value = 0;
	consolePrint("Selected realization (ID: "+(selectedSimulationID+1)+" before) was removed succesfully!");

	if(simulations.length==0){
		plotData();
		document.getElementById("currentObjectiveFunctionValue").value= 0;
	}else{
		updateStaticPlots();
		document.getElementById("currentObjectiveFunctionValue").value= simulations[0].objectiveFunctionValue.toFixed(3);	
	}
	
}



function realizationSelectDropdownChanged(){
	var id = document.getElementById("realizationSelectDropDown").value;
	document.getElementById("currentObjectiveFunctionValue").value = simulations[id].objectiveFunctionValue.toFixed(3);	
	consolePrint("Selected Realization Changed");
}






function panaltyChanged(id,value){
	if(id == 1){
		departureTimePanaltyAlpha = value;
		consolePrint("Deprature time panalty changed to "+value);
	}else if(id == 2){
		controlInputPanaltyBeta	= value;
		consolePrint("Control input panalty changed to "+value);
	}else if(id == 3){
		waitingTimePanaltyGamma = value;
		consolePrint("Waiting time panalty changed to "+value);
	}
}


function consolePrint(consoleText){
    document.getElementById("consoleText").innerHTML += ">> "+consoleText+"<br>";
    document.getElementById("consoleText").scrollTop = document.getElementById("consoleText").scrollHeight;
}















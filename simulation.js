
function Simulation(N,aArray,qArray,alpha,beta,gamma,uArray) {

	this.id = simulations.length;

	this.numberOfArrivals = N;
	
	this.arrivalTimesArray = aArray;
	this.qualityLevelsArray = qArray;
	this.controlInputsArray = uArray;


	this.departureTimePanaltyAlpha = alpha; 
	this.controlInputPanaltyBeta = beta; 
	this.waitingTimePanaltyGamma = gamma; 

	// temporary
	this.departureTimeArray = []; 	// x_i
	this.waitingTimeArray = [];		// w_i
	this.eventTimeArray = [];		// t
	this.queueLengthArray = [];		// X(t)

	// for real-time simulations
	this.currentQueueLength = 0;

	this.simulateDES = function(){

		var queLength = 0;
		var simT = 0;
		var eventSpace = [[], this.arrivalTimesArray[0]]; // [[known departure times],next arrivaltime] ascending order
		var eventSpaceIndexes = [[],1]; // x_0 and a_1 are active (hence 0,1)

		while(queLength	> 0 || eventSpaceIndexes[1] <= this.numberOfArrivals){
				
			if(eventSpace[0].length == 0 || eventSpace[0][0]>eventSpace[1]){// arrival is going to happen 
				
				var i = eventSpaceIndexes[1];
				var a_i = eventSpace[1]; // (same as this.arrivalTimesArray[i-1])
				print("Arrival of job "+i+" at t="+a_i);
				var q_i = this.qualityLevelsArray[i-1];
				var u_i = this.controlInputsArray[i-1];

				queLength = queLength + 1;
				simT = a_i;
				this.queueLengthArray.push(queLength);
				this.eventTimeArray.push(simT); 
				
				var x_i;
				if(queLength==1){
					x_i = a_i + q_i/u_i
				}else{
					x_i = eventSpace[0][eventSpace[0].length-1]	 + q_i/u_i;
				}
				this.departureTimeArray.push(x_i);
				this.waitingTimeArray.push(x_i - a_i);

				eventSpaceIndexes[0].push(i);
				eventSpaceIndexes[1] = eventSpaceIndexes[1] + 1; 

				eventSpace[0].push(x_i);// add departure event at x_i	
				eventSpace[1] = this.arrivalTimesArray[i];  // remove the arrival event at a_i

			}else{ // arrival as well as a departure occurs or only departure occurs 
				if(eventSpace[0][0]>eventSpace[1]){print("critical event!!!");}

				var i = eventSpaceIndexes[0][0];
				var x_i = eventSpace[0][0];

				print("Departure of job "+i+" at t="+x_i);

				queLength = queLength - 1;
				simT = x_i;
				this.queueLengthArray.push(queLength);
				this.eventTimeArray.push(simT); 
				
				eventSpaceIndexes[0].shift();				
				eventSpace[0].shift();// add departure event at x_i	

			}



		}



	}



	this.evaluateObjectiveFunction = function(){
		var cost = 0;
		for(var i = 0; i<this.numberOfArrivals; i++){

			cost = cost + this.departureTimePanaltyAlpha*sq(this.departureTimeArray[i]) + this.controlInputPanaltyBeta*sq(this.controlInputsArray[i]) + this.waitingTimePanaltyGamma*sq(this.waitingTimeArray[i]);

		}
		print("Cost of simulation: "+cost);
		consolePrint("Cost of the added simulation: "+ cost);
		
		return cost;
	}






	this.update = function(){
		// use simulation time to identify the state of the system and draw the diagram
		
		// what is the queue length corresponding to currens simulation time?
		var currentQueueLength = this.getCurrentQueueLength();

		if(currentQueueLength > this.currentQueueLength){ // arrival has occured !
			
			var i = entities.length;
			newEntity = new Entity(simulationTime,this.arrivalTimesArray[i],this.qualityLevelsArray[i],this.controlInputsArray[i],this.departureTimeArray[i]);
			newEntity.targetQueueSlot = currentQueueLength-1; // 0 if server is the slot
			entities.push(newEntity);
			consolePrint("New job arrives at t = "+simulationTime.toFixed(2)); 

		}else if(currentQueueLength < this.currentQueueLength){ // departure
			for(var i = 0; i<entities.length; i++){
				entities[i].targetQueueSlot = entities[i].targetQueueSlot - 1;
			}
		}

		this.currentQueueLength = currentQueueLength; // update the discrete state of the simulation - discrete
		this.physicalStateUpdate(); // updating the continuous state of the system (individual physical entities)
		showPointInPlot();

	}

	this.physicalStateUpdate = function(){
		for(var i = 0 ; i<entities.length; i++){
			entities[i].update();
			entities[i].show();
		}
	}

	this.getCurrentQueueLength = function(){
		// use simulationTime
		for(var i = 0; i<this.eventTimeArray.length-1; i++){

			if(this.eventTimeArray[i]<=simulationTime && simulationTime<this.eventTimeArray[i+1]){
				return this.queueLengthArray[i];
			}

		}
		if(simulationTime<this.eventTimeArray[0]){
			return 0; // before the first arrival
		}else if(simulationTime>this.eventTimeArray[i]){
			return 0; // after the last departure
		}
	}





	this.getMaximumQuality = function(){
		var maximumQualityFound = 0;
		for(var i = 0; i<this.qualityLevelsArray.length; i++){
			if(this.qualityLevelsArray[i]>=maximumQualityFound){
				maximumQualityFound = this.qualityLevelsArray[i];
			}
		}
		return maximumQualityFound;
	}









	// simulate and load the temporary valuesvalues
	this.simulateDES();

	this.objectiveFunctionValue = this.evaluateObjectiveFunction();// J



}







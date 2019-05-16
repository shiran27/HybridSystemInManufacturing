
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







	// simulate and load the temporary valuesvalues
	this.simulateDES();

	this.objectiveFunctionValue = this.evaluateObjectiveFunction();// J



}



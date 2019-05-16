function generateExponential(rate){

	var U = Math.random();
	return -1*Math.log(1-U)/rate;

}

function generateUniform(rate,rateMax){//(2/(T_max+T_min) , 1/T_min)

	var U = Math.random();
	////var rateRandom = 2*rate - rateMax + (rateMax-rate)*2*U;
	////var rateRandom = rateMax - 2*(rateMax-rate)*U;
	////return 1/rateRandom;
	var TMin = 1/rateMax;
	var TMax = 2/rate-TMin; 
	return TMin + (TMax-TMin)*U;
}

function generateDeterministic(rate){

	return 1/rate;

}

function sq(val){
	return	Math.pow(val,2);
}






function solveForControlInputs(){
	result = [];
	for(var i = 0; i<numberOfArrivals; i++){
		result.push(i);
	}
	return result;

	//// known variables:  (to compute the  controlInputArray)

	//numberOfArrivals;
	//arrivalTimesArray;
	//qualityLevelsArray;
	//departureTimePanaltyAlpha; 
	//controlInputPanaltyBeta; 
	//waitingTimePanaltyGamma; 



}
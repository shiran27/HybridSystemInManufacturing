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

	
	
	// dummy values
	controlInputArray = [];
	for(var i = 1; i<=numberOfArrivals; i++){
		controlInputArray.push(i);
	}


	// foward algorithm
	var k = 0;
	var n = 0;
	var N = numberOfArrivals;
	while(n<N){
		print("Solving Q("+k+","+n+")");
		var result = quickSolve(k,n);
		if(result[1]){// busy period ends at n
			for(var j = k; j<=n; j++){controlInputArray[j] = qualityLevelsArray[j]/result[0][j];}
			k = n + 1;		
		}
		n = n + 1;	
	}	


	//quickSolve(0,numberOfArrivals-1); // solving Problem Q(k,n) use - computer indexes

	
	return controlInputArray;



}


function quickSolve(k,n){
	
	var a = arrivalTimesArray;
	a[a.length] = 10000; // inf
	var q = qualityLevelsArray;
	var u = controlInputArray;  // contains dummy set of values

	// begin initializtion
	// variables s_k,s_(k+1),...,s_n : (n-k+1) - variables
	var s = []; // service times array - creating place holders
	
	// (n-k) Constraints : on s_k,s_(k+1),...,s_(n-1)------> feasible initial condition is required
	// constraint : a_k + \sum_(j=k)^i s_j >= a_(i+1)
	
	var sSum = 0;
	var delta = 0.5;
	
	for(var i = 0; i<q.length; i++){
		
		if(k <= i && i <= n-1){

			var s_i = a[i+1]-a[k]-sSum+delta;
			////print("for i = "+i+", s_i = "+s_i+" chosen. a_i="+a[i]+"a_i+1 = "+a[i+1]);
			////print("for i = "+i+", s_i = "+s_i.toFixed(3)+" chosen.");
			s.push(s_i);	
			sSum  = sSum + s_i;
			
		}else{
			s.push(q[i]/u[i]); // these u_i's are irrelevent and assumed known - just to keep the space
		}

	}
	////checkFeasibility(a,s,k,n);
	// initializing finished



	// gradient descent - on s_m; m \in [k,n]
	var stepSize = 0.005;
	var maxStepsCounts = 1000000; // number of max update steps 
	for(var K = 0; K < maxStepsCounts; K++){ 
		//////print("Iteration K ="+K);
		var sumGrad = 0;
		var sNew = s;

		for(var m = k; m<=n; m++){
			var grad_m = computeGradient(a,q,s,k,n,m);
			var s_m = s[m] - stepSize*grad_m;	
			if(s_m<0){s_m = timeResolution*10;}
			sumGrad	= sumGrad + sq(grad_m);
			sNew[m] = s_m;
		}
		if(Math.sqrt(sumGrad)<0.001){
			print("Optimum found! K ="+K);
			K = maxStepsCounts;
		}



		// projection
		var sSum = 0; // projections
		for(var m = k; m<n; m++){
			if(sNew[m] -a[m+1]+a[k]+sSum < 0){
				sNew[m] = a[m+1]-a[k]-sSum; 
				if(sNew[m]<0){
					print("Error: K="+K+", k="+k+", n="+n+", m="+m+", s_m="+sNew[m]);
				} 
			}
			sSum = sSum	+ sNew[m];
		}
			// end projection




		s = sNew;
		// if(checkFeasibility(a,sNew,k,n)){
		// 	print("Feasible update at step = "+K)
		// 	s = sNew;
		// }else{
		// 	s = sNew;
		// 	print("Need to project!")
		// }
	}

	// end gradient descent



	

	if(a[n]+s[n] < a[n+1]){
		print("k="+k+", n="+n+"s="+s+"endBusy");
		
		return [s, true];
	}else{
		print("k="+k+", n="+n+"s="+s+"stillBusy");
		return [s, false];
	}





}




function computeGradient(a,q,s,k,n,m){
	// print("s="+s[m]);
	var term1 = -2*controlInputPanaltyBeta*sq(q[m])/Math.pow(s[m],3);
	
	var term2_1 = 2*(departureTimePanaltyAlpha+waitingTimePanaltyGamma)*a[k]*(n-m+1);
	
	var sum_a = 0;
	for(var i = m; i<=n; i++){
		sum_a = sum_a + a[i];
	}
	var term2_2 = -2*waitingTimePanaltyGamma*sum_a;

	var doubleSum = 0;
	for(var i = m; i<=n; i++){
		for(var j = k; j<=i; j++){
			doubleSum = doubleSum + s[j];
		}
	}

	var term3 = 2*(departureTimePanaltyAlpha+waitingTimePanaltyGamma)*doubleSum;

	var gradComponent = (term1 + term2_1 + term2_2 + term3); 
	// print(term1);
	// print(term2_1);
	// print(term2_2);
	// print(term3);
	////print("m: "+m+"-th compo.="+gradComponent.toFixed(2));
	return gradComponent;

}


function sq(val){
	return Math.pow(val,2);
}


function checkFeasibility(a,s,k,n){
	result = true;
	var sSum = 0;
	for(var  i = k; i<=n-1; i++){
		sSum = sSum + s[i];
		if(a[k] + sSum < a[i+1]){
			print("Bad initial condition!");
			////print("i = "+i+", a[k] = "+a[k]+", sSum = "+sSum+", a_k+1 ="+a[i+1]+" diff = "+(-a[k] - sSum + a[i+1])+".");
			return false;
		}else{
			print("Condition for i = "+i+" is true!");
		}
	}

	print("Good initial condition.");
	// if(a[k] + sSum + s[n] < a[n+1]){
	// 	print("Ends the busy period!");
	// }else{
	// 	print("Continue the busy period!");
	// }
	return true
}
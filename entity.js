function Entity(simT,arrivalTime,qualityLevel,controlInput,departureTime){

	this.birthTime = simT;
	this.id = entities.length;
	this.initialRadius = 12;

	this.arrivalTime = arrivalTime;
	this.qualityLevel = qualityLevel;
	this.controlInput = controlInput;
	this.departureTime = departureTime;
	this.serviceTime = qualityLevel/controlInput;

	this.currentMode = 0;// approaching queue, 1: in queue; 2: in service: 3: Leaving
	this.physicalState = 0; // will increase once it is in the server

	this.currentRadius = this.initialRadius;
	this.finalRadius = this.initialRadius + this.qualityLevel*(serverRadius-5-this.initialRadius)/maximumQuality; 



	this.position = new Point2(10,150);
	
	// important locations
	this.serverPosition = new Point2(300,150);


	// dead


	this.update = function(){

		// use simulation time and a_i,q_i,u_i,x_i to draw the position of the antity
		// serviceTime = s_i(u_i) = q_i/u_i 
		
		if(this.currentMode == 0 && simulationTime < this.departureTime-this.serviceTime){// must join the que
			
			var currentQueueCapacity = simulations[selectedSimulationIndex].currentQueueLength - 1; 
			
			if(currentQueueCapacity<0){// go directy to server
				this.position = this.serverPosition;
				this.currentMode = 2;
				this.currentState = 0; // initiate processing 		
			}else{

				var velocity = 5;
				this.position.x = this.position.x + velocity;

				var targetPositionInQueue = 300-serverRadius-10-currentQueueCapacity*20+5;
				if(this.position.x > targetPositionInQueue){
					this.postion = new Point2(targetPositionInQueue,150);
					this.currentMode = 1; // positioned properly in the queue
				}
			}
			
		}else if(this.currentMode == 1 && simulationTime < this.departureTime-this.serviceTime){// in que
			var currentQueueCapacity = simulations[selectedSimulationIndex].currentQueueLength-2; 
			var targetPositionInQueue = 300-serverRadius-10-currentQueueCapacity*20+5;
			if(currentQueueCapacity<0){// go directy to server
				this.position = this.serverPosition;
				this.currentMode = 2;
				this.currentState = 0; // initiate processing 		
			}else{
				if(this.position.x < targetPositionInQueue){
					this.position.x = targetPositionInQueue;// jumpt to the next slot
				}
			}
			
		}else if(this.departureTime-this.serviceTime <= simulationTime && simulationTime<this.departureTime){// in server
			this.currentMode = 2;
			this.position = this.serverPosition;
			this.physicalState = this.physicalState + this.controlInput*timeResolution;
			this.currentRadius = this.initialRadius + this.physicalState*(this.finalRadius-this.initialRadius)/this.qualityLevel;

		}else{// leaving
			var velocity = 10;
			if(this.position.x <600){
				this.position.x = this.position.x + velocity;
			}
		}
		
		

	}


	this.show = function(){
		

		if(this.currentMode < 2){
			fill(255,0,0);
			noStroke();
			circle(this.position.x,this.position.y,this.initialRadius);
			

			fill(0,0,0);
	        rectMode(CENTER);
	        textAlign(CENTER,CENTER);
	        text((this.id+1).toString(),this.position.x,this.position.y);
		}else if(this.currentMode == 2){

			fill(0,255,0);
			stroke(1);
			circle(this.position.x,this.position.y,this.finalRadius);
			
			fill(255,0,0);
			noStroke();
			circle(this.position.x,this.position.y,this.currentRadius);

			
			

			fill(0,0,0);
			noStroke();
	        rectMode(CENTER);
	        textAlign(CENTER,CENTER);
	        text((this.id+1).toString(),this.position.x,this.position.y);
		}





		
      
	}



}
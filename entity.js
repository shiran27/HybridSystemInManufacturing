function Entity(simT,arrivalTime,qualityLevel,controlInput,departureTime){

	this.birthTime = simT;
	this.id = entities.length;
	this.initialRadius = 6;

	this.arrivalTime = arrivalTime;
	this.qualityLevel = qualityLevel;
	this.controlInput = controlInput;
	this.departureTime = departureTime;
	this.serviceTime = qualityLevel/controlInput;

	this.currentMode = 0;
	this.physicalState = 0; // will increase once it is in the server

	this.currentRadius = this.initialRadius;
	this.finalRadius = this.initialRadius + this.qualityLevel*(serverRadius-10-this.initialRadius)/maximumQuality; 

	this.targetQueueSlot = 0;


	this.position = new Point2(10,150);
	
	// important locations
	this.serverPosition = new Point2(300,150);


	// dead




	this.update = function(){

		// use simulation time and a_i,q_i,u_i,x_i to draw the position of the antity
		// serviceTime = s_i(u_i) = q_i/u_i 
		//// var targetPositionInQueue = 300-serverRadius-10-currentQueueCapacity*20-10;
		
		if(simulationTime < this.departureTime-this.serviceTime){// must join the que

			
			var targetPositionInQueue = 300-serverRadius-this.targetQueueSlot*20;
			if(this.id==entities.length-1 && this.targetQueueSlot>=1){
				this.position.x = this.position.x + 20;
				if(this.position.x>targetPositionInQueue){
					this.position.x = targetPositionInQueue;
				}
			}else{
				
				this.position.x = targetPositionInQueue;
			}

		}else if(this.departureTime-this.serviceTime <= simulationTime && simulationTime<this.departureTime){// in server
			this.currentMode = 2;
			this.position = this.serverPosition;
			this.physicalState = this.physicalState + this.controlInput*timeResolution;
			this.currentRadius = this.initialRadius + this.physicalState*(this.finalRadius-this.initialRadius)/this.qualityLevel;

		}else if(simulationTime>=this.departureTime){// leaving
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
			circle(this.position.x,this.position.y,this.initialRadius*2);
			

			fill(0,0,0);
	        rectMode(CENTER);
	        textAlign(CENTER,CENTER);
	        text((this.id+1).toString(),this.position.x,this.position.y);
		
		}else if(this.currentMode == 2){

			noFill();
			stroke(0,0,255);
			strokeWeight(1);
			circle(this.position.x,this.position.y,this.finalRadius*2);


			fill(255,0,0);
			noStroke();
			circle(this.position.x,this.position.y,this.currentRadius*2);

			
			fill(0,0,0);
			noStroke();
	        rectMode(CENTER);
	        textAlign(CENTER,CENTER);
	        text((this.id+1).toString(),this.position.x,this.position.y);
		}





		
      
	}



}
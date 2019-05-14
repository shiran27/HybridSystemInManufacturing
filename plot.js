function plotData(){

   	//constructSpaceForPlots();
	

   	if(queueLengthPlotMode){
		var trace1 = {x:eventTimeArray, y: queueLengthArray, type: 'scatter', line: {shape: 'hv'}};
	   	
	   	var plotLayout1 = 
			{
				title: 'Evolution of Objective Function Value', 
				////autosize: true,
			    //width: 1000,
			    height: 350,
			    ////automargin: true,
			    xaxis: {
					title: 'Simulation Time / (s)', 
					showline: true,
					showgrid: true, 
					zeroline: true,
					////automargin: true,
				}, 
				yaxis: {
					title: 'Queue Length', 
				    showline: true,
				    showgrid: true,
				    zeroline: true,
				    ////automargin: true,
				},
				
	   		}

		var myPlot1 = document.getElementById('myPlot1');
				////Plotly.newPlot(myPlot, data, plotLayout,{displayModeBar: false});
		Plotly.newPlot(myPlot1, [trace1], plotLayout1);
	}



}



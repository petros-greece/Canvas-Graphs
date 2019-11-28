function Graph(canvasId, options){
	this.canvas = document.getElementById(canvasId);
	this.ctx = this.canvas.getContext("2d");
	this.cW = this.canvas.width;
	this.cH = this.canvas.height;
	this.xAxisLen = (this.cW*.95) - (this.cW*.05);
	this.yAxisLen = (this.cH*.9) - (this.cH*.125);
	this.data = options.data;
	var axisX = this.axisX = options.axisX ? options.axisX : Object.keys(options.data)[0];
	this.axisY = options.axisY ? options.axisY : Object.keys(options.data)[1];
	this.steps = options.steps ? options.steps : 1;
	this.type = options.type ? options.type : 'standard';
	this.sortType = options.sortType ? options.sortType : 'standard';
	this.numericAxis = parseInt( this.data[0][axisX] ) >= 0 ? 'x' : 'y';
	if(options.palette){
		this.palette = options.palette;
		this.palette.background = options.palette.background ? options.palette.background : 'white';
		this.palette.axisDividers = options.palette.axisLines ? options.palette.axisDividers : 'yellow';
		this.palette.fontColor = options.palette.fontColor ? options.palette.fontColor : 'purple';
		this.palette.axisLines = options.palette.axisLines ? options.palette.axisLines : 'black';
		this.palette.graphStroke = options.palette.graphStroke ? options.palette.graphStroke : 'lime';
		this.palette.graphFill = options.palette.graphFill ? options.palette.graphFill : 'red';
		this.palette.fontSize = options.palette.fontSize ? options.palette.fontSize : 13;
		this.palette.fontWeight = options.palette.fontWeight ? options.palette.fontWeight : 100;
		this.palette.fontFamily = options.palette.fontFamily ? options.palette.fontFamily : 'Times New Roman';
		this.palette.axisDividersWidth = options.palette.axisDividersWidth ? options.palette.axisDividersWidth : 1;		
		this.palette.axisWidth = options.palette.axisWidth ? options.palette.axisWidth : 1 ;
		this.palette.graphWidth = options.palette.graphWidth ? options.palette.graphWidth : 1;		
		this.palette.axisLineCap = options.palette.axisLineCap ? options.palette.axisLineCap : 'round';
		this.palette.axisDividersLineCap = options.palette.axisDividersLineCap ? options.palette.axisDividersLineCap : 'round';
		this.palette.graphLineCap = options.palette.graphLineCap ? options.palette.graphLineCap : 'round';
		this.palette.columnFontColor = options.palette.columnFontColor ? options.palette.columnFontColor : 'black';
		
	}
	else{
		this.palette = {
			background:  'white',
			axisDividers:  'yellow',
			fontColor: 'purple',
			axisLines: 'black',
			graphStroke: 'lime',
			graphFill: 'red',
			fontSize: 13,
			fontWeight: 100,
			fontFamily: 'Times New Roman',
			axisDividersWidth: 1,
			axisWidth: 1,
			graphWidth: 1,
			axisLineCap: 'round',//butt, square
			axisDividersLineCap: 'round',
			graphLineCap: 'round',
			columnFontColor: 'black'
		}
	}
	this.dataLen = options.data.length;

}

Graph.prototype.sort = function(){
	
	var sortField = (this.numericAxis === 'y') ? this.axisY : this.axisX;

	function sortAsc(a, b) {		
		if (a[sortField] === b[sortField]) {
			return 0;
		}
		else {
			return (a[sortField] < b[sortField]) ? -1 : 1;
		}
	}	
	
	function sortDesc(a, b) {		
		if (a[sortField] === b[sortField]) {
			return 0;
		}
		else {
			return (b[sortField] < a[sortField]) ? -1 : 1;
		}
	}	
	
	if(this.sortType === 'asc'){
		this.data.sort(sortAsc);
	}
	else if(this.sortType === 'desc'){
		this.data.sort(sortDesc);
	}
}

Graph.prototype.init = function(){
	this.xSteps = [];
	this.ySteps = [];
	
	if(this.sortType){
		this.sort();
	}
	
	for(var i=0;i<this.dataLen;i+=1){
		var x = this.data[i][this.axisX];
		var y = this.data[i][this.axisY];
		this.xSteps.push(x);
		this.ySteps.push(y);
	}	
	

	var whichArr = (this.numericAxis === 'y') ? this.ySteps : this.xSteps;
	var nums = Object.values(whichArr);
	this.min = Math.min.apply(null, nums);
	this.max = Math.max.apply(null, nums);		
	
	var which = (this.numericAxis === 'y') ? [this.dataLen, (this.max - this.min)] : [(this.max - this.min), this.dataLen];
		
	//calculate distances 	
	this.xDist = this.xAxisLen/which[0];
	this.yDist = this.yAxisLen/which[1];	
	//calculate starting axis points 
	this.startX = this.cW*.05 + this.xDist;
	this.startY = this.cH*.9 - this.yDist;
}

Graph.prototype.drawGraphNumericY = function(){
	var ctx = this.ctx, cW = this.cW, cH = this.cH, palette = this.palette;	
	
	/******DRAW AXIS DIVIDERS***********/
	ctx.beginPath();
	ctx.font = palette.fontWeight+' '+palette.fontSize+'px '+palette.fontFamily;
	ctx.strokeStyle = palette.axisDividers;
	ctx.fillStyle = palette.fontColor;
	ctx.lineWidth = palette.axisDividersWidth;
	ctx.lineCap = palette.axisDividersLineCap;	
	
	//draw X axis points and verbs
	for(var i=0;i<this.dataLen;i+=1){
		var axisXPos = this.startX + (this.xDist*i);		
		//x axis points
		ctx.moveTo(axisXPos, cH*.9);
		ctx.lineTo(axisXPos, cH*.95);
		//verb
		var xText = this.data[i][this.axisX];
		var xTextWidth = ctx.measureText(xText).width;
		ctx.fillText(xText, axisXPos-(xTextWidth/2), cH*.98);		
	}
	
	//draw Y axis points and numbers
	for(var i=this.min;i<=this.max;i+=this.steps){		
		var axisYPos = this.startY - (this.yDist*(i-this.min));		
		//y axis points
		ctx.moveTo(cW*.05, axisYPos);
		ctx.lineTo(cW*.04, axisYPos);
		//verb nums
		var yTextWidth = ctx.measureText(i).width;
		ctx.fillText(i, cW*.03 - yTextWidth, axisYPos+3);		
	}

	ctx.stroke();
	
	/******DRAW GRAPH***********/
	ctx.beginPath();
	ctx.strokeStyle = palette.graphStroke;
	ctx.fillStyle = palette.graphFill;		
	ctx.lineWidth = palette.graphWidth;
	ctx.lineCap = palette.graphLineCap;
	
	ctx.moveTo(cW*.05, cH*.9);
		
	for(var i=0;i<this.dataLen;i+=1){
		var axisXPos = this.startX + (this.xDist*i);
		var axisYPos = this.startY - (this.ySteps[i]*this.yDist)+this.min*this.yDist;
		ctx.lineTo(axisXPos, axisYPos);		
	}

	ctx.lineTo(this.startX + (this.xDist*(this.dataLen-1)), cH*.9);

}

Graph.prototype.drawGraphNumericX = function(){
		var ctx = this.ctx, cW = this.cW, cH = this.cH, palette = this.palette;
				
		/******DRAW AXIS DIVIDERS***********/
		ctx.beginPath();
		ctx.font = palette.fontWeight+' '+palette.fontSize+'px '+palette.fontFamily;
		ctx.strokeStyle = palette.axisDividers;
		ctx.fillStyle = palette.fontColor;
		ctx.lineWidth = palette.axisDividersWidth;
		ctx.lineCap = palette.axisDividersLineCap;
		
		//draw X axis points and numbers
		for(var i=this.min;i<=this.max;i+=this.steps){
			var axisXPos = this.startX + (this.xDist*(i-this.min));
			//x axis points
			ctx.moveTo(axisXPos, cH*.9);
			ctx.lineTo(axisXPos, cH*.95);			
			//verb
			var xTextWidth = ctx.measureText(i).width;
			ctx.fillText(i, axisXPos-(xTextWidth/2), cH*.98);				
		}
					
		//draw Y axis points and verbs
		for(var i=0;i<this.dataLen;i+=1){		
			var axisYPos = this.startY - (this.yDist*i);		
			//x axis points
			ctx.moveTo(cW*.05, axisYPos);
			ctx.lineTo(cW*.04, axisYPos);
			//verb
			var yText = this.data[i][this.axisY];
			var yTextWidth = ctx.measureText(yText).width;
			ctx.fillText(yText, (cW*.03-yTextWidth), axisYPos+3);			
		
		}	
		
		ctx.stroke(); 
		
		/******DRAW GRAPH***********/
		ctx.beginPath();
		ctx.strokeStyle = palette.graphStroke;
		ctx.fillStyle = palette.graphFill;		
		ctx.lineWidth = palette.graphWidth;
		ctx.lineCap = palette.graphLineCap;
		
		ctx.moveTo(cW*.05, cH*.9);
		
		for(var i=0;i<this.dataLen;i+=1){
			var axisXPos = this.startX + (this.xSteps[i]*this.xDist)-this.min*this.xDist;
			var axisYPos = this.startY - (this.yDist*i);
			ctx.lineTo(axisXPos, axisYPos);			
		}
		ctx.lineTo(cW*.05, this.startY - (this.yDist*(this.dataLen-1)));
					
}

Graph.prototype.drawColumnsGraphNumericY = function(){
	var ctx = this.ctx, cW = this.cW, cH = this.cH, palette = this.palette;	
	
	/******DRAW AXIS DIVIDERS***********/
	ctx.beginPath();
	ctx.font = palette.fontWeight+' '+palette.fontSize+'px '+palette.fontFamily;
	ctx.strokeStyle = palette.axisDividers;
	ctx.fillStyle = palette.fontColor;
	ctx.lineWidth = palette.axisDividersWidth;
	ctx.lineCap = palette.axisDividersLineCap;	
	
	//draw X axis points and verbs
	for(var i=0;i<this.dataLen;i+=1){
		var axisXPos = this.startX + (this.xDist*i) - this.xDist/2;		
		//x axis points
		ctx.moveTo(axisXPos, cH*.9);
		ctx.lineTo(axisXPos, cH*.95);
		//verb
		var xText = this.data[i][this.axisX];
		var xTextWidth = ctx.measureText(xText).width;
		ctx.fillText(xText, axisXPos-(xTextWidth/2), cH*.98);		
	}
	
	//draw Y axis points and numbers
	for(var i=this.min;i<=this.max;i+=this.steps){		
		var axisYPos = this.startY - (this.yDist*(i-this.min));		
		//y axis points
		ctx.moveTo(cW*.05, axisYPos);
		ctx.lineTo(cW*.04, axisYPos);
		//verb nums
		var yTextWidth = ctx.measureText(i).width;
		ctx.fillText(i, cW*.03 - yTextWidth, axisYPos+3);		
	}

	ctx.stroke();
	
	/******DRAW GRAPH***********/
	ctx.beginPath();
	ctx.strokeStyle = palette.graphStroke;
	ctx.fillStyle = palette.graphFill;		
	ctx.lineWidth = palette.graphWidth;
	ctx.lineCap = palette.graphLineCap;
	
	ctx.moveTo(cW*.05, cH*.9);

	for(var i=0;i<this.dataLen;i+=1){
		var axisXPos = this.startX + (this.xDist*(i-1));
		var axisYPos = this.startY - (this.ySteps[i]*this.yDist)+this.min*this.yDist;
		var height = cH*.9 - axisYPos;
		ctx.fillRect(axisXPos, axisYPos, this.xDist, height);
		ctx.strokeRect(axisXPos, axisYPos, this.xDist, height);
		
		ctx.save();
		ctx.translate(axisXPos + (this.xDist/2) + palette.fontSize/2 , cH*.9);
		ctx.rotate(-Math.PI/2);
		ctx.fillStyle = palette.columnFontColor;
		ctx.font = palette.fontWeight+' '+(2*palette.fontSize)+'px '+palette.fontFamily;
		ctx.fillText(this.data[i][this.axisX], 10, 0);
		ctx.restore();		
	}

						
	ctx.lineTo(this.startX + (this.xDist*(this.dataLen-1)), cH*.9);
		
}

Graph.prototype.drawColumnsGraphNumericX = function(){
		var ctx = this.ctx, cW = this.cW, cH = this.cH, palette = this.palette;
				
		/******DRAW AXIS DIVIDERS***********/
		ctx.beginPath();
		ctx.font = palette.fontWeight+' '+palette.fontSize+'px '+palette.fontFamily;
		ctx.strokeStyle = palette.axisDividers;
		ctx.fillStyle = palette.fontColor;
		ctx.lineWidth = palette.axisDividersWidth;
		ctx.lineCap = palette.axisDividersLineCap;
		
		//draw X axis points and numbers
		for(var i=this.min;i<=this.max;i+=this.steps){
			var axisXPos = this.startX + (this.xDist*(i-this.min));
			//x axis points
			ctx.moveTo(axisXPos, cH*.9);
			ctx.lineTo(axisXPos, cH*.95);			
			//verb
			var xTextWidth = ctx.measureText(i).width;
			ctx.fillText(i, axisXPos-(xTextWidth/2), cH*.98);				
		}
					
		//draw Y axis points and verbs
		for(var i=0;i<this.dataLen;i+=1){		
			var axisYPos = this.startY - (this.yDist*i) + (this.yDist/2) ;		
			//x axis points
			ctx.moveTo(cW*.05, axisYPos);
			ctx.lineTo(cW*.04, axisYPos);
			//verb
			var yText = this.data[i][this.axisY];
			var yTextWidth = ctx.measureText(yText).width;
			ctx.fillText(yText, (cW*.03-yTextWidth), axisYPos+3);			
		
		}	
		
		ctx.stroke(); 
		
		/******DRAW GRAPH***********/
		ctx.beginPath();
		ctx.strokeStyle = palette.graphStroke;
		ctx.fillStyle = palette.graphFill;		
		ctx.lineWidth = palette.graphWidth;
		ctx.lineCap = palette.graphLineCap;
		
		ctx.moveTo(cW*.05, cH*.9);
		
		ctx.font = palette.fontWeight+' '+(2*palette.fontSize)+'px '+palette.fontFamily;
		
		for(var i=0;i<this.dataLen;i+=1){
			var axisXPos = this.startX + (this.xSteps[i]*this.xDist)-this.min*this.xDist;
			var axisYPos = this.startY - (this.yDist*i);
			var width = this.xSteps[i]*this.xDist-this.min*this.xDist+this.xDist;
			ctx.fillRect(cW*.05, axisYPos, width, this.yDist);
			ctx.strokeRect(cW*.05, axisYPos, width, this.yDist);
			ctx.save();
			ctx.fillStyle = palette.columnFontColor;			
			ctx.fillText(this.data[i][this.axisY], cW*.05 + 10, axisYPos+(this.yDist*.65));
			ctx.restore();
			 	
		}		
		 
		
	
					
}

Graph.prototype.drawGraph = function(){
	var ctx = this.ctx, cW = this.cW, cH = this.cH, palette = this.palette;
	/******SET BACKGROUND***********/		
	ctx.beginPath();
	ctx.fillStyle = palette.background;		
	ctx.clearRect(0, 0, cW, cH);
	ctx.fillRect(0, 0, cW, cH);

  	if(this.type === 'standard'){
		if(this.numericAxis === 'y'){
			this.drawGraphNumericY();		
		}
		else if(this.numericAxis === 'x'){
			this.drawGraphNumericX();			
		}
	}  
	else if(this.type === 'column'){
		if(this.numericAxis === 'y'){
			this.drawColumnsGraphNumericY();		
		}
		else if(this.numericAxis === 'x'){
			this.drawColumnsGraphNumericX();			
		}	 
	}
	
	ctx.closePath();
	ctx.fill();	
	ctx.stroke();
	
	/******DRAW AXIS***********/
	ctx.beginPath();
	ctx.strokeStyle = palette.axisLines;		
	ctx.lineWidth = palette.axisWidth;
	ctx.lineCap = palette.axisLineCap;
	//x axis
	ctx.moveTo(cW*.05, cH*.9);
	ctx.lineTo(cW*.98, cH*.9);
	ctx.stroke();
	//y axis
	ctx.moveTo(cW*.05, cH*.9);
	ctx.lineTo(cW*.05, cH*.05);
	ctx.stroke();

	
}

Graph.prototype.show = function(){
	this.init();
	this.drawGraph();
}

Graph.prototype.render = function(canvasId, options){
	var graph = new Graph(canvasId, options);
	graph.show();
	//console.log(this.data);
}




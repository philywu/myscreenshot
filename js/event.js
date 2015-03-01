
//event methods
evtImgSelect = function(evt){
	// set current select to front.
	console.log("click");
	evt.stopImmediatePropagation();
	var g = this.parent();
	var cvs = g.parent();
	g.remove();
	cvs.add(g);
	
	//set selected
	
	var selected = g.data("selected");
	var ele1 = SSImage.getElement(g);
	if (!selected) {
		// add rectangle		
			ele1.clearAllSelection();
			ele1.addImgSelection();
			g.data("selected",true);
			this.drag(evtImgDragMove,evtImgDragStart,evtImgDragEnd);
	} else {
	/*d
		if (!dragged) {			
			ele1.clearAllSelection();
			this.undrag();
		} 
		*/
	}
	
};
evtImgDragStart = function () {
		
		var g = this.parent();
		console.log("drag start");
		if (g.data("selected")) {
			g.data('origTransform', g.transform().local );
			
		}
		
	}
evtImgDragEnd =function (event) {
		var g = this.parent();

		//check if dragged, keep selection
		
		var startPos = g.data("MStartPos");
		//if(!((startPos.mx == event.x) && (startPos.my==event.y))) {
			
		//	this.click(evtImgSelect);
		//}
		console.log("drag end: ");
		
		g.data('origTransform',undefined);
	}
evtImgDragMove = function (dx,dy) {
		var g = this.parent();
		
		if (g.data("selected")) {
			g.attr({
					transform: g.data('origTransform') + (g.data('origTransform') ? "T" : "t") + [dx, dy]
				});
			
		}
		
	}
evtImgMU  = function(event) {
	event.preventDefault();
	var g = this.parent();
	var startPos = g.data("MStartPos");
	var p = getSVGPoint(svgDom,event);
	//this.unclick(evtImgSelect);
	console.log(p.x,p.y,startPos.mx,startPos.my);
	//if ((startPos.mx == p.x) && (startPos.my==p.y)) {
	//	this.click(evtImgSelect);
	//} 
	g.data("mousedown",false);
	//g.data("currentPainter",undefined);
	console.log("mouse up");
	
}
evtImgMD  = function(event) {
	var g = this.parent();
	
	event.preventDefault();
	g.data("mousedown",true);
	var p = getSVGPoint(svgDom,event);
	g.data("MStartPos",{"mx":p.x,"my":p.y});
	
	var painter = SSPainter.getElement(g.select(".painter"));	
	var ptype = SSPainter.getPTypeFromKey(SSKeypress.ctlPressed,SSKeypress.altPressed,SSKeypress.shiftPressed);
	console.log(ptype);
	if (ptype) {	
	//paint action
		this.undrag();
		this.unclick(evtImgSelect);
		
	} else if (g.data("selected")) {
	// move action
		this.drag(evtImgDragMove,evtImgDragStart,evtImgDragEnd);
		
	} else {
	// click action
		this.click(evtImgSelect);
	}
	//if (!g.data("selected")) {
	if (ptype == 'R') {	
		//var painter = SSPainter.getElement(g.select(".painter"));
		var box = painter.drawBox(p.x,p.y,0,0);		
		g.data("currentPainter",box.attr("id"));
		
	}
}

evtImgMM = function (event) {	
	var d = 5 ;
	
	event.preventDefault();
	var g = this.parent();
	//console.log(g.data("selected"),g.data("mousedown"));
	var ptype = SSPainter.getPTypeFromKey(SSKeypress.ctlPressed,SSKeypress.altPressed,SSKeypress.shiftPressed);
	//if (!g.data("selected") && g.data("mousedown")) {
	if (g.data("mousedown")) {
		if (ptype == 'R') {
			var startPos = g.data("MStartPos");
			var p = getSVGPoint(svgDom,event);
			var w = p.x-startPos.mx;
			var h = p.y-startPos.my;
			
			if (Math.abs(w)>d  || Math.abs(h)>d) {
				
				var painter = g.select(".painter");
				var currentPainter = g.data("currentPainter");			
				if (currentPainter) {
					var rect1 = painter.select("#"+currentPainter);							
					rect1.attr({
						width:w ,
						height:h				
					});
				}
				
			}	
			//console.log("mouse move",painter);
		}
	}
}


evtImgMO = function (event) {
	var g = this.parent();	
	g.data("mousedown",false);
}
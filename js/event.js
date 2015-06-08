
//Image event methods
// click 
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
		if (g.data("selected")) {
		 var lm = g.transform().localMatrix ; 
		 if (lm) {
			g.data("MRelPos",{"rx":lm.e,"ry":lm.f});
			
		 }
		
			
		} else {
			this.undrag();
		}
		console.log("drag end: " );
		
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
	var p = SSUtil.getSVGPoint(svgDom,event);
	
	//this.unclick(evtImgSelect);
	console.log(startPos.mx,startPos.my,p.x,p.y);
	//console.log(event.clientX, event.clientY);
	//console.log(g.data("MRelPos").rx, g.data("MRelPos").ry);
	if ((startPos.mx == p.x) && (startPos.my==p.y)) {
		this.click(evtImgSelect);
	} 
	g.data("MStartPos",undefined);
	g.data("mousedown",false);
	g.data("currentPainter",undefined);
	console.log("mouse up");
	
}
evtImgMD  = function(event) {
	var g = this.parent();	
	event.preventDefault();
	g.data("mousedown",true);
	//coordination convertion
	var p = SSUtil.getSVGPoint(svgDom,event);
	g.data("MStartPos",{"mx":p.x,"my":p.y});
	
	//var painter = SSPainter.getElement(g.select(".painter"));	
	var painter = SSPainter.getPainter(g);	
	var ptype = SSPainter.getPTypeFromKey(SSKeypress.ctlPressed,SSKeypress.altPressed,SSKeypress.shiftPressed);
	console.log(ptype);
	if (ptype) {	
	//paint action
	// donnot trigger drag or click event if want to do paint.
		this.undrag();
		this.unclick(evtImgSelect);
		// draw initial box;
		if (ptype == 'R') {	
			//var painter = SSPainter.getElement(g.select(".painter"));
			var box = painter.drawBox(p.x,p.y,0,0);		
			g.data("currentPainter",box.boxId);
			
		}
	} else if (g.data("selected")) {
	// move action
	// trigger drag event if the image is selected.
		//this.drag(evtImgDragMove,evtImgDragStart,evtImgDragEnd);
		
	} else {
	
	}
	
}

evtImgMM = function (event) {	
	var d = 5 ;
	
	event.preventDefault();
	var g = this.parent();
	//console.log(g.data("selected"),g.data("mousedown"));
	
	//if (!g.data("selected") && g.data("mousedown")) {
	if (g.data("mousedown")) {
	    var ptype = SSPainter.getPTypeFromKey(SSKeypress.ctlPressed,SSKeypress.altPressed,SSKeypress.shiftPressed);
		if (ptype == 'R') {
		// redraw rectangle.
			var startPos = g.data("MStartPos");
			var relPos= g.data("MRelPos");			
			var p = SSUtil.getSVGPoint(svgDom,event);
			var w = p.x-startPos.mx;
			var h = p.y-startPos.my;
					
			if (Math.abs(w)>d  || Math.abs(h)>d) {							
				var rectX = (w<0)?p.x:startPos.mx;
				var rectY = (h<0)?p.y:startPos.my;			
				if (relPos) {
					rectX -= relPos.rx;
					rectY -= relPos.ry;
				}
				var currentPainter = g.data("currentPainter");							
				if (currentPainter) {
					var painter = SSPainter.getPainter(g);
					painter.drawBox(rectX,rectY,Math.abs(w),Math.abs(h),currentPainter);
					
				}
				
			}	
			//console.log("mouse move",painter);
		}
	}
}


evtImgMO = function (event) {
	console.log("mouse out", this);
	var g = this.parent();	
	var ptype = SSPainter.getPTypeFromKey(SSKeypress.ctlPressed,SSKeypress.altPressed,SSKeypress.shiftPressed);
	if (!ptype) {	
	g.data("mousedown",false);
	}
}

//
// event canvas
 evtCanvasClick = function(evt) {
	this.clearAllSelection();
 
 }
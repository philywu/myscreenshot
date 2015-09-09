
//Image event methods
// click 
evtImgSelect = function(evt){
	// set current select to front.
	console.log(" this click");
	evt.stopImmediatePropagation();
	var g = this.parent();
	
	//set selected
	
	var selected = g.data("selected");
	var ele1 = SSImage.getElement(g);
	ele1.bringFront(g);
	console.log("select: " ,selected);
	if (!selected) {
		// add rectangle					
			ele1.clearAllSelection();
			ele1.addImgSelection();
			g.data("selected",true);
			//this.drag(evtImgDragMove,evtImgDragStart,evtImgDragEnd);
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
			//this.undrag();
		}
		g.data("currentPainter",undefined);
		g.data("mode",undefined);
		console.log("drag end: " );
		
		g.data('origTransform',undefined);
		
	}
evtImgDragMove = function (dx,dy) {
		var g = this.parent();
		
		if (g.data("selected")&& g.data("mode")=="drag") {
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
	
	//console.log(startPos.mx,startPos.my,p.x,p.y);
	
	var ptype = SSPainter.getPTypeFromKey(SSKeypress.ctlPressed,SSKeypress.altPressed,SSKeypress.shiftPressed);
	//console.log(ptype);
	var painter = SSPainter.getPainter(g);
	
	if (ptype) {
		if (ptype == 'H') {	
			var d = "M " + startPos.mx + "," +startPos.my + "L " + p.x + "," + p.y +"Z";
			console.log(d);
			//SSPainter.highlight(startPos.mx, startPos.my);
			/*
			var p = painter.path(d);
			p.attr( {
				class:"highlighter"
			});			
			*/
		}
	}
	
	
	g.data("MStartPos",undefined);
	g.data("mousedown",false);
	g.data("currentPainter",undefined);
	g.data("mode",undefined);
	console.log("mouse up");
	
}
evtImgMD  = function(event) {
	var g = this.parent();	
	event.preventDefault();
	g.data("mousedown",true);
	//coordination convertion
	var p = SSUtil.getSVGPoint(svgDom,event);
	g.data("MStartPos",{"mx":p.x,"my":p.y});
	console.log("mouse down",p.x,p.y);
	//var painter = SSPainter.getElement(g.select(".painter"));	
	var painter = SSPainter.getPainter(g);	
	var ptype = SSPainter.getPTypeFromKey(SSKeypress.ctlPressed,SSKeypress.altPressed,SSKeypress.shiftPressed);
	//console.log(ptype);
	if (ptype) {	
	//paint action
	// donnot trigger drag or click event if want to do paint.
		// draw initial box;
		g.data("mode","draw");
		if (ptype == 'R') {	
			//var painter = SSPainter.getElement(g.select(".painter"));
			var box = painter.drawBox(p.x,p.y,0,0);		
			g.data("currentPainter",box.boxId);
			
		}
		if (ptype == 'H') {	
			//var painter = SSPainter.getElement(g.select(".painter"));
			var highlighter = painter.highlight(p.x,p.y);		
			g.data("currentPainter",highlighter.hId);
			
		}
	} else if (g.data("selected")) {
	// move action
	// trigger drag event if the image is selected.
		//this.drag(evtImgDragMove,evtImgDragStart,evtImgDragEnd);
		g.data("mode","drag");
	} else {
		g.data("mode","click");
	}
	
}

evtImgMM = function (event) {	
	var d = 5 ;
	
	event.preventDefault();
	var g = this.parent();
	//console.log(g.data("selected"),g.data("mousedown"));
	var mode = g.data("mode");
	
	//if (!g.data("selected") && g.data("mousedown")) {
	if (mode =="draw" && g.data("mousedown")) {
	    var ptype = SSPainter.getPTypeFromKey(SSKeypress.ctlPressed,SSKeypress.altPressed,SSKeypress.shiftPressed);
		if (ptype) {
			var p = SSUtil.getSVGPoint(svgDom,event);
			var startPos = g.data("MStartPos");
			var relPos= g.data("MRelPos");			
			var currentPainter = g.data("currentPainter");		
			if (ptype == 'R') {
			// redraw rectangle.
				//var startPos = g.data("MStartPos");
				
				
				var w = p.x-startPos.mx;
				var h = p.y-startPos.my;
						
				if (Math.abs(w)>d  || Math.abs(h)>d) {							
					var rectX = (w<0)?p.x:startPos.mx;
					var rectY = (h<0)?p.y:startPos.my;			
					
				if (relPos) {
						rectX -= relPos.rx;
						rectY -= relPos.ry;
					}
					
					//console.log (startPos.mx,startPos.my,rectX,rectY);
					if (currentPainter) {
						var painter = SSPainter.getPainter(g);
						painter.drawBox(rectX,rectY,Math.abs(w),Math.abs(h),currentPainter);
						
					}
					
				}	
				//console.log("mouse move",painter);
			}
			if (ptype == 'H') {				
				if (currentPainter) {
						var painter = SSPainter.getPainter(g);
						
						var x0 = startPos.mx;
						var y0 = startPos.my;
						var x1 = p.x;
						var y1 = p.y;
						if (relPos) {
							x0 = startPos.mx - relPos.rx;
							y0 = startPos.my - relPos.ry;
							x1 = p.x - relPos.rx;
							y1 = p.y - relPos.ry;
						}
						painter.highlight(x1,y1,currentPainter,x0,y0);
						
					}
			}
		}
	}
}


evtImgMO = function (event) {
	//console.log("mouse out", this);
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
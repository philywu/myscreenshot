
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
	ele1.clearAllSelection();
	if (!selected) {
		// add rectangle								
			ele1.addImgSelection();
			g.data("selected",true);
			//this.drag(evtImgDragMove,evtImgDragStart,evtImgDragEnd);
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
	var relPos= g.data("MRelPos");		
	var startPos = {"mx":p.x,"my":p.y};	
	g.data("MStartPos",startPos);
	console.log("mouse down",p.x,p.y);
	//var painter = SSPainter.getElement(g.select(".painter"));	
	var painter = SSPainter.getPainter(g);	
	var ptype = SSPainter.getPTypeFromKey(SSKeypress.ctlPressed,SSKeypress.altPressed,SSKeypress.shiftPressed);
	var pt0 = SSUtil.getConvertPoint(startPos,relPos);
	//console.log(ptype);
	if (ptype) {	
	//paint action
	// donnot trigger drag or click event if want to do paint.
		// draw initial box;
		g.data("mode","draw");
		if (ptype == 'R') {	
			//var painter = SSPainter.getElement(g.select(".painter"));
			var box = painter.drawBox(pt0.x,pt0.y,0,0);		
			g.data("currentPainter",box.boxId);
			
		}
		if (ptype == 'H') {	
			//var painter = SSPainter.getElement(g.select(".painter"));
			var highlighter = painter.highlight(pt0.x,pt0.y);		
			g.data("currentPainter",highlighter.id);
			
		}
		if (ptype == 'A') {	
			//var painter = SSPainter.getElement(g.select(".painter"));
			var arrowLine = painter.arrowline(pt0.x,pt0.y);		
			g.data("currentPainter",arrowLine.id);
			
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
			var pt0 = SSUtil.getConvertPoint(startPos,relPos);
			var pt1 = SSUtil.getConvertPoint(p,relPos);
			if (ptype == 'R') {
			// redraw rectangle.
				//var startPos = g.data("MStartPos");
				
				
				var w = p.x-startPos.mx;
				var h = p.y-startPos.my;
						
				if (Math.abs(w)>d  || Math.abs(h)>d) {							
					pt0.x = (w<0)?p.x:startPos.mx;
					pt0.y = (h<0)?p.y:startPos.my;			
					
					pt0 = SSUtil.getConvertPoint(pt0,relPos);
						
					//console.log (startPos.mx,startPos.my,rectX,rectY);
					if (currentPainter) {
						var painter = SSPainter.getPainter(g);
						painter.drawBox(pt0.x,pt0.y,Math.abs(w),Math.abs(h),currentPainter);
						
					}
					
				}	
				//console.log("mouse move",painter);
			}
			if (ptype == 'H') {				
				if (currentPainter) {
						var painter = SSPainter.getPainter(g);														
						painter.highlight(pt1.x,pt1.y,currentPainter,pt0.x,pt0.y);
						
					}
			}
			if (ptype == 'A') {				
				if (currentPainter) {
						var painter = SSPainter.getPainter(g);														
						painter.arrowline(pt1.x,pt1.y,currentPainter,pt0.x,pt0.y);												
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
evtImgDblClick = function(event) {
	console.log("double click here");
	var g = this.parent();
	var selected = g.data("selected");
	var ele1 = SSImage.getElement(g);
	//clear current selection for image
	ele1.clearAllSelection();
	// add text
	var painter = SSPainter.getPainter(g);		
	var p = SSUtil.getSVGPoint(svgDom,event);
	var relPos= g.data("MRelPos");	
	var pt1 = SSUtil.getConvertPoint(p,relPos);
	//painter.writeText(pt1.x,pt1.y,"hello mate");
	painter.showTextEditor(pt1.x,pt1.y);
}
//
// event canvas
 evtCanvasClick = function(evt) {
	this.clearAllSelection();
 
 }
 //event Text
 evtTextClick = function(evt) {
	evt.stopImmediatePropagation();
	console.log("text click",this);
	this.attr( {
		class:"textselect"
	}
	);
 }
 evtTextEditorBlur = function(evt) {
	console.log("text blur");
	//var g = this.parent();
	var input = $(this);
	var fo = input.parent();
	//var g = fo.parent(); // the g of foreign object
	var pg = fo.parent();
	//var ppg = this.parent;
	var painter = SSPainter.getPainter(pg);		
	var x = fo.attr("x");
	var y = fo.attr("y");
	console.log(pg,input);
	y = parseInt(y) + 15 ; //adjust the position	
	painter.writeText(x,y,this.value);
	fo.remove();
	
	
 }
 evtTextEditorKeyup = function(evt) {
	var charCode = (evt.which) ? evt.which : evt.keyCode
	if (charCode == 13) { // pressed 'enter'
		console.log("text key ",this);
		this.blur();
	}
 }
 
 
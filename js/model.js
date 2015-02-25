 // SSElement
 //var SSElement = function(){};
 /*
 *  Class SSImage 111
 */
 

 var SSElement = {
	name:"SSElement", 
	init : function(paper) {
		 $.extend(this,paper.g());
		
		return this;
	},
	test: function(){
		return ("SSElement1");
	},
	getElement:function(g) {
		$.extend(this,g);
		return this ;
	},
	clearAllSelection : function() {
		var s = Snap.selectAll('.currentSelectionG');
		var imageG;
		s.forEach(function(ele){
			//clear element selection
			imageG = ele.parent();
			imageG.data("selected",false);
			var img1 = imageG.select("image");
			if (img1) {
				img1.undrag();
				img1.unclick();
			}
			//remove rectangle
			ele.remove();
		});
		

	},	
	
	
 };//end of SSElement
 
 /*
 *  Class SSImage
 */
 var SSImage = {
	x:10,
	y:10,
	name:"SSImage",
	
	bindEvent: function(img){
		//img.click(evtImgSelect);
		
		//img.drag(evtImgDragMove,evtImgDragStart,evtImgDragEnd);
		img.mousedown(evtImgMD);		
		img.mouseup(evtImgMU);
		img.mousemove(evtImgMM);
		img.mouseout(evtImgMO);
	},
	loadImg : function (dataURL,w,h){
	   		
		this.bindEvent(this.image(dataURL,this.x,this.y,w,h));
		var painter = SSPainter.init(this);
		painter.attr({
			class:"painter"
		});
		painter.bindEvent();
	},
	getImg : function() {
		return (this.select("image"));
	},
	addImgSelection : function () {
		var img = this.getImg();
		var eleR = SSSelectBox.init(this.paper).draw(this.x,this.y,img.getBBox().w,img.getBBox().h);
		
		/*
		r.attr({
		filter:"url(#f3)"
		});
		*/
		
		this.add(eleR);
		
	},
 };
 //Extend class here
 $.extend(true,SSImage,SSElement);
 //override method here
 
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
	/*
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
		if(!((startPos.mx == event.x) && (startPos.my==event.y))) {
			
			this.click(evtImgSelect);
		}
		console.log("drag end");
		
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
	this.unclick(evtImgSelect);
	//console.log(p.x,p.y,startPos.mx,startPos.my);
	if ((startPos.mx == p.x) && (startPos.my==p.y)) {
		this.click(evtImgSelect);
	} 
	g.data("mousedown",false);
	//console.log("mouse up");
}
evtImgMD  = function(event) {
	var g = this.parent();
	event.preventDefault();
	g.data("mousedown",true);
	var p = getSVGPoint(svgDom,event);
	g.data("MStartPos",{"mx":p.x,"my":p.y});
	
	if (!g.data("selected")) {
		
		var painter = SSPainter.getElement(g.select(".painter"));
		var box = painter.drawBox(p.x,p.y,0,0);		
		g.data("currentPainter",box.attr("id"));
		
	}
}

evtImgMM = function (event) {	
	var d = 5 ;
	
	event.preventDefault();
	var g = this.parent();
	//console.log(g.data("selected"),g.data("mousedown"));
	if (!g.data("selected") && g.data("mousedown")) {
	
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


evtImgMO = function (event) {
	var g = this.parent();	
	g.data("mousedown",false);
}
  /*
 *  Class SSCanvas
 */
 var SSCanvas = {
	x:0,
	y:0,
	background:"",
	bgConfig:{
		stroke:"navy",
		strokeWidth: 2,
		fill:"#FFF"
		//fill:"url(#Grid)"
		//,"fill-opacity":0.1
		//,filter:"url(#f3)"
		},
	setBackground: function() {
		this.background = this.rect(this.x,this.y,"100%","100%");
		this.background.attr(this.bgConfig);
		//this.add(this.background);
		this.click(evtCanvasClick);
	}	
	
 };
 //Extend class here
 $.extend(true,SSCanvas,SSElement);
 //override method here
// event
 evtCanvasClick = function(evt) {
	this.clearAllSelection();
 
 }
 ;//end of SSCanvas
 
  /*
 *  Class SSPainter
 */
 var SSPainter = {
	x:0,
	y:0,
	bindEvent : function() {
		this.click(evtPtClick);
	},
	drawBox : function (x,y,w,h) {
		var rect = this.rect(x,y,w,h);
		var rid = this.genID("R");
		
		rect.attr ({
			class:"rectbox",
			id:rid
		});
		return rect ; 
	},
	genID :function (PType) {
		var list,shape,count =0 ;
		switch (PType) {
			case "R": shape = "rect" ;
		}
		var list = this.selectAll(shape);		
		return PType + list.length ; 
	}
 };
 //Extend class here
 $.extend(true,SSPainter,SSElement);
 //override method here
// event
 evtPtClick = function(evt) {
	//this.clearAllSelection();
	console.log("painter click");
 
 }
 ;//end of SSPainter
 
 
   /*
 *  Class SSSelectBox
 */
 var SSSelectBox = {
	//length of small rect on corner.
	l:4,
	draw: function(x,y,w,h) {
	var l = this.l ; 
		var r = this.rect(x,y,w,h);
		r.addClass("currentSelection");
		var r1 = this.rect(x,y,l,l);
		 var r2 = this.rect(x+w-l,y,l,l);
	var r3 = this.rect(x+w-l,y+h-l,l,l);
	var r4 = this.rect(x,y+h-l,l,l);
	this.addClass("currentSelectionG");
	return this;
	}	
	
 };
 //Extend class here
 $.extend(true,SSSelectBox,SSElement);
 //override method here

 ;//end of SSSelectBox

//utility

//SSKeypress
var SSKeypress = {
	keyAction : function (keyCode,paper) {
		//console.log("key:" ,keyCode);
		switch (keyCode) {
			case 46: // delete
				this.deleteCurrent();
				break;
		}
			
	},
	deleteCurrent: function() {
		var s = Snap.selectAll(".currentSelectionG");
		var imageG;
		s.forEach(function(ele){
			//clear element selection
			imageG = ele.parent();
			imageG.remove();
			
		});
	}
}

   getSVGPoint = function(el,evt){
	
    pt.x = evt.clientX; pt.y = evt.clientY;
    return pt.matrixTransform(el.getScreenCTM().inverse());
  }

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
		img.click(evtImgSelect);
		
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
		//painter.bindEvent();
	},
	getImg : function() {
		return (this.select("image"));
	},
	addImgSelection : function () {
		var img = this.getImg();
		img.drag(evtImgDragMove,evtImgDragStart,evtImgDragEnd);
		var eleR = SSSelectBox.init(this.paper).draw(this.x,this.y,img.getBBox().w,img.getBBox().h);
		
		/*
		r.attr({
		filter:"url(#f3)"
		});
		*/		
		this.add(eleR);
		
		
	}
 };
 //Extend class here
 $.extend(true,SSImage,SSElement);
 //override method here
 
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
	},
	getPTypeFromKey:function(ctr,alt,shift) {
		//get Painter type from input key
		// H : highligher
		// R : Rectangle
		// P : pen
		var pType ;
		if (ctr) {
			pType = 'H';			
		}else if (alt) {
			pType = 'R';			
		} else if (shift) {
			pType = 'L';
		}
		return pType;
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
	 ctlPressed: false,
	 altPressed: false,
	 shiftPressed: false,
	keyAction : function (keyCode,paper) {
		console.log("key:" ,keyCode);
		switch (keyCode) {
			case 46: // delete
				this.deleteCurrent();
				break;
		}
			
	},
	keyDown : function (keyCode,paper) {
		//console.log("key down:" ,keyCode);
		switch (keyCode) {
			case 46: // delete
				this.deleteCurrent();
				break;
			case 16: // Shift
				this.shiftPressed = true;
				break;
			case 17: // control
				this.ctlPressed = true;
				break;
			case 18: // Alt
				this.altPressed = true;
				break;
		}
			
	},
	keyUp : function (keyCode,paper) {
		//console.log("key up:" ,keyCode);		
		switch (keyCode) {
			case 46: // delete
				this.deleteCurrent();
				break;
			case 16: // Shift
				this.shiftPressed = false;
				break;
			case 17: // control
				this.ctlPressed = false;
				break;
			case 18: // Alt
				this.altPressed = false;
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

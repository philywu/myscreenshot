 // SSElement
 //var SSElement = function(){};
 /*
 *  Class SSImage 111
 */
 

 var SSElement = {
	name:"SSElement", 
	init : function(paper) {
		console.log(paper);
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
			/*
			if (img1) {
				img1.undrag();
				img1.unclick();
			}
			*/
			//remove rectangle
			ele.remove();
		});
		
		this.clearPainterSelection();
	},	
	bringFront: function(g) {		
		var cvs = g.parent();
		g.remove();
		cvs.add(g);
	},
	clearPainterSelection() {
		SSText.clearTextSelection();
	}
	
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
		img.dblclick(evtImgDblClick);
		img.drag(evtImgDragMove,evtImgDragStart,evtImgDragEnd);
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
		//img.drag(evtImgDragMove,evtImgDragStart,evtImgDragEnd);
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

 ;//end of SSCanvas
 
  /*
 *  Class SSPainter
 */
 var SSPainter = {
	x:0,
	y:0,
	boxList:[],
	bindEvent : function() {
		this.click(evtPtClick);
	},
	getPainter : function(g) {
		var painter = this.getElement(g.select(".painter"));
		//get SSPaintBox list
		//painter.boxList=[];
		//var rectboxList = painter.selectAll("rect");
		//rectboxList.forEach(function(ele){
		//	var b = SSPaintBox.getElement(ele);
		//	painter.boxList.push(b);
		//});
		return painter;
	},
	drawBox : function (x,y,w,h,rid) {
		if (!rid) {
		// initial draw
			var box = SSPaintBox.init(this);
			box.draw(x,y,w,h,this.genID("R"));		
			this.boxList.push(box);
			return box ; 
		} else {
		//resize
			var rect1 = this.select("#"+rid);
			if (rect1) {
				rect1.attr({
					x:x,
					y:y,
					width:w ,
					height:h				
				});
			}
		}
	},
	highlight : function (x,y,hid,x0,y0) {		
		if (!hid) {
			
			var highlighter = SSHighligher.init(this);			
			highlighter.draw(x,y,x,y,this.genID(SSHighligher.identifier)); 
			return highlighter ; 
		} else {
			var hl = this.select("#"+hid);
			var pt=SSHighligher.genPath(x0,y0,x,y);					
			hl.attr({
				path:pt
			});
			
		}
	},
	arrowline : function (x,y,aid,x0,y0) {
		if (!aid) {
			var arrowLine = SSArrowLine.init(this);			
			arrowLine.draw(x,y,x,y,this.genID(SSArrowLine.identifier)); 
			return arrowLine ; 
		} else {
			var al = this.select("#"+aid);
			var pt=SSArrowLine.genPath(x0,y0,x,y);					
			al.attr({
				path:pt
			});
			
		}
	},
	writeText : function(x,y,text,tid) {
		var eleText = SSText.init(this);
		eleText.write(x,y,text,this.genID(SSText.identifier));
		
		return eleText ;
	},
	showTextEditor: function(x,y) {
					
			var eleText = SSText.init(this);
			eleText.showEditor(x,y,this.genID(SSText.identifier));
			//$.extend(fo,this.g());
			//this.append(fo);
			//console.log(fo);
	
	},
	genID :function (PType) {
		var list,shape,count =0 ;
		switch (PType) {
			case "R": shape = "rect";
				break ;
			case "H" : shape= "path" ;
				break;
			case "A" : shape= "path" ;
				break;
			case "T" : shape ="text" ;
				break;
			
		}
		var list = this.selectAll(shape);		
		return PType + list.length ; 
	},
	getPTypeFromKey:function(ctr,alt,shift) {
		//get Painter type from input key
		// H : highligher
		// R : Rectangle
		// P : pen
		// A : Arrow
		var pType ='' ;
		if (ctr) {
			pType = 'A';			
		}else if (alt) {
			pType = 'R';			
		} else if (shift) {
			pType = 'H';
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
 *  Class SSPainterItem
 */
 var SSPainterItem = {
	painter:"",
	init : function(painter) {
	//	console.log(paper);
	//	 $.extend(this,paper.g());		
		this.painter = painter; 
		return this;
	}
 }
  ;//end of SSPainterItem
 
 /*
 *  Class SSPaintBox
 */
 var SSPaintBox = {
	boxId:"",
	draw: function (x,y,w,h,rid) {
		var rect = this.rect(x,y,w,h);
		rect.attr ({
			class:"rectbox",
			id:rid
		});
		this.boxId = rid;
	}
	
 }
  //Extend class here
 $.extend(true,SSPaintBox,SSElement);
  ;//end of SSPainter
 
 /*
 *  Class SSPath
 */
 var SSPath = {
	id:"",
	draw: function (x,y,x1,y1,pid) {			
		var path = this.painter.path(this.genPath(x,y,x1,y1));
		path.attr ({
			class:this.cssClass,
			id:pid
		});
		this.id = pid;
	},
	genPath(x,y,x1,y1) {
		return 'M' + x +','+y+'L'+x1 +','+y1; 
	}
	
 }
  //Extend class here
 $.extend(true,SSPath,SSPainterItem);
  ;//end of SSPath
 
 
 /*
 *  Class SSHighligher
 */
 var SSHighligher = {
	//hId:"",
	identifier :"H",
	cssClass :"highlighter"
	
 }
  //Extend class here
 $.extend(true,SSHighligher,SSPath);
  ;//end of SSHighligher
 
  /*
 *  Class SSArrowLine
 */
 var SSArrowLine = {
	identifier :"A",
	cssClass : "arrowline"
 }
  //Extend class here
 $.extend(true,SSArrowLine,SSPath);
  ;//end of SSArrowLine
 
 /*
 *  Class SSPath
 */
 var SSText = {
	identifier :"T",
	id:"",
	cssClass:"textnode",
	cssSelectClass:"textselect",
	write: function (x,y,text,tid) {			
		var txt = this.painter.g().text(x,y,text);
		txt.attr ({
			class:this.cssClass,
			id:tid
		});
		this.id = tid;
		this.bindEvent(txt);
	},
	bindEvent : function(txt) {
		txt.click(evtTextClick);		
	},
	showEditor(x,y) {
		var foVal = '<foreignObject width="200" height="150"><input type="text" id="textEditor" value=""/></foreignObject>';
		var fragFO = Snap.parse(foVal);	
		var fo = fragFO.select("foreignObject");
		
		fo.attr({
			x:x,
			y:y		
		});
		var input = fo.select("input");
		$(input.node).blur(evtTextEditorBlur);
		$(input.node).keyup(evtTextEditorKeyup);		
		this.painter.append(fo);
		//input.node.on("blur",evtTextEditorBlur);
		input.node.focus();
		
		//console.log(fo,input);
	},	
	clearTextSelection() {
		var sel = Snap.selectAll("."+this.cssSelectClass);
		sel.forEach(function(ele){
			//clear element selection
			console.log(ele);
			ele.attr({
			"class":SSText.cssClass
			});			
			
		});
	}
	
	
 }
  //Extend class here
 $.extend(true,SSText,SSPainterItem);
  ;//end of SSText
 
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

 //end of SSSelectBox

//utility
 /*
 *  Class SSSelectBox
 */
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
			default: 
				this.shiftPressed = false;
				this.ctlPressed = false;
				this.altPressed = false;
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
//end of SSKeypress

 /*
 *  Class SSUtil
 */
 var SSUtil = {
   getSVGPoint :function(el,evt){
	
	var pt1 =  el.createSVGPoint();
    //pt.x = evt.clientX; pt.y = evt.clientY;
	pt1.x = evt.clientX; pt1.y = evt.clientY;
    return pt1.matrixTransform(el.getScreenCTM().inverse());
  },
  getConvertPoint : function(pt,relPt) {
		var valPt = {x:0,y:0};
		if (pt.mx) { // startPos
			valPt.x = pt.mx;
			valPt.y = pt.my;
		} else { // SVGPoint
			valPt.x = pt.x;
			valPt.y = pt.y;
		}
		if (relPt) {
			valPt.x -= relPt.rx ; 
			valPt.y -= relPt.ry ; 
		} 
		return valPt;
		
  }
}
//end of SSUtil

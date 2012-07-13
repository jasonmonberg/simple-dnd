//using class properties (as static variables) because references to 'this' do not refer to 
//the object when we assign the mouse handlers to the web page event handling functions, it ends up referring to the HTML document
function Dnd (className, dragCursor, hoverCursor) {
	Dnd.dragElementClassName = className; //the class name to look for when an element is clicked. if it matches it is draggable.
	Dnd.dragCursor = dragCursor;
	Dnd.hoverCursor = hoverCursor;
	Dnd.debug = true;
	
	//'static' variables
	Dnd.startX = 0;            	//starting position of the mouse
	Dnd.startY = 0;
	Dnd.offsetX = 0;           	//the offset between the selected element and the starting mouse position
	Dnd.offsetY = 0;
	Dnd.dragElement;           	// global reference to pass the element from OnMouseDown to OnMouseMove
	Dnd.dragElementZIndex = 0;  //the original Z Index of teh dragged element
	
	//debug
	if (Dnd.debug) console.log("created dnd object");
};

Dnd.prototype.OnMouseOver = function(e) {
	//set the hover cursor for the element
	var target = Dnd.prototype.getTarget(e);
	if (target.className == Dnd.dragElementClassName)
		target.style.cursor = Dnd.hoverCursor;
}

Dnd.prototype.OnMouseDown = function(e) {
    // IE does not pass the event object
    if (e == null) e = window.event; 
    
    // IE uses srcElement, others use target
    var target = e.target != null ? e.target : e.srcElement;
    
    //set the drag cursor for the element
    target.style.cursor = Dnd.dragCursor;
    
    //debug
    if (Dnd.debug) {
    	var msg = "element clicked: ";
	    if (target.className == Dnd.dragElementClassName)
	        msg = msg + 'draggable';
	        else msg = msg + 'NON-draggable';
	    console.log(msg);
    }
    
    //for IE, left click == 1
    //for Firefox, left click == 0
    if ((e.button == 1 && window.event != null || e.button == 0) &&
    	target.className == Dnd.dragElementClassName) {
        
    	//grab the mouse position
        Dnd.startX = e.clientX;
        Dnd.startY = e.clientY;
        
        //debug
        if (Dnd.debug) console.log("MOUSE DOWN X:" + Dnd.startX + "  Y:" + Dnd.startY);
        
        //set the clicked element's starting position
        var tx = target.style.left.slice(0, target.style.left.length - 2);
        Dnd.offsetX = Dnd.startX - tx;
        var ty = target.style.top.slice(0, target.style.top.length - 2);
        Dnd.offsetY = Dnd.startY - ty;
        
        //debug
        if (Dnd.debug) {
        	console.log("WIDGET START X:" + target.style.left + "  Y:" + target.style.top);
        	console.log("WIDGET/MOUSE OFFSET X:" + Dnd.offsetX + "  Y:" + Dnd.offsetY);
        }
        
        // bring the clicked element to the front while it is being dragged
        Dnd.dragElementZIndex = target.style.zIndex;
        target.style.zIndex = 10000;
        
        // make the drag element available to other functions e.g. OnMouseDown
        Dnd.dragElement = target;

        //move the draggable element with the mouse
        document.onmousemove = Dnd.prototype.OnMouseMove;
        
        //cancel out any text selections
        document.body.focus();

        //prevent text selection in IE
        document.onselectstart = function () { return false; };
        //prevent IE from trying to drag an image
        target.ondragstart = function() { return false; };
        
        // prevent text selection (except IE)
        return false;
    }
};

//if there is a selected element, drag that element with the mouse
Dnd.prototype.OnMouseMove = function (e) {
    if (e == null) 
        var e = window.event; 

    //this is the actual "drag code"
    var xLoc = e.clientX - Dnd.offsetX;
    var yLoc = e.clientY - Dnd.offsetY;
    if (xLoc > 0) Dnd.dragElement.style.left = xLoc + 'px';
    if (yLoc > 0) Dnd.dragElement.style.top = (yLoc) + 'px';
    
    //debug
    if (Dnd.debug) {
    	console.log("MOUSE DRAG X:" + e.clientX + "  Y:" + e.clientY);
    	console.log("OFFSET DRAG X:" + Dnd.offsetX + "  Y:" + Dnd.offsetY);
    	console.log("WIDGET DRAG X:" + Dnd.dragElement.style.left + "  Y:" + Dnd.dragElement.style.top);
    	
    }
};

//if there is a selected element, stop dragging and clean-up.
Dnd.prototype.OnMouseUp = function(e) {
    if (Dnd.dragElement != null)
    {
    	//reset the z index and teh cursor
        Dnd.dragElement.style.zIndex = Dnd.dragElementZIndex;
        
        // we're done with these events until the next OnMouseDown
        document.onmousemove = null;
        document.onselectstart = null;
        Dnd.dragElement.ondragstart = null;

        //this is how we know we're not dragging      
        Dnd.dragElement = null;
        
       if (Dnd.debug) { 
    	   console.log('mouse up');
       }
    }
};

Dnd.prototype.OnMouseOut = function(e) {
	//set the hover cursor for the element
	var target = Dnd.prototype.getTarget(e);
	if (target.className == Dnd.dragElementClassName)
		target.style.cursor = "default";
}

Dnd.prototype.getTarget = function(e) {
	// IE uses srcElement, others use target
    return e.target != null ? e.target : e.srcElement;
}


























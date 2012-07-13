simple-dnd
==========

A simple drag and drop library for javascript web clients

simple-dnd supports:
- dragging and dropping HTML elements in a web based client
- manages the cursor during hover and drag
- preserves z-ordering
- blocks dragging into negative screen areas i.e. objects cannot be dragged off screen to the left or the top

A working example is provided in example.html

To use simple-dnd:
- create a Dnd instance supplying the name of the classes that are draggable and cursor styles for hovering and dragging.
- assign the mouse events to the Dnd mouse events

Here is an example of the javascript code that you would put in the header of a web page in order to drag and drop elements where there class is "widget"

```javascript
	//className of element to be dragged
	//cursor style when hovering
	//cursor style when dragging
	var dnd = new Dnd("widget", "move", "move");
	
	//bind events
	document.onmouseover = 	dnd.OnMouseOver;
	document.onmousedown = 	dnd.OnMouseDown;
	document.onmouseup = 	dnd.OnMouseUp;
	document.onmouseout = 	dnd.OnMouseOut;
```
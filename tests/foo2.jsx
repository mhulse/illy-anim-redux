#target illustrator
#targetengine main

var palette = new Window('palette', 'Test', undefined, { resizeable: true });
var button = palette.add('button', undefined, 'Test');
var info = palette.add('edittext', undefined, '100');

function someFunction() {
	// get data from the application
	return app.activeDocument.selection.length;
}

button.onclick = function() {
	
	// make a BridgeTalk object to throw the script
	var bt = new BridgeTalk();
	bt.target = 'illustrator';
	
	// a string containing javascript code to execute in Illustrator
	bt.body = someFunction.toString()+'someFunction();';
	
	// a function that recieves whatever the body JS above returns
	bt.onResult = function(result) {
        $.writeln(result.body);
		info.text = result.body;
	};
	
	bt.send();
	
};

palette.onShow = function () { palette.layout.resize(); }

palette.center();
palette.show();

$.writeln('finished');
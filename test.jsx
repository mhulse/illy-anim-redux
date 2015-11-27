#target illustrator
#targetengine main

var NS = 'FOO';
var TITLE = 'Test';
var doc = app.activeDocument;

// BridgeTalk message:
var btm = function(fun_name, parameters) {
	
	var ref_parameters;
	var bt;
	var msg;
	
	// Test type of parameters:
	if (parameters != undefined) {
		if ((typeof parameters == 'string') || (parameters instanceof String)) {
			ref_parameters = ((parameters != undefined) ? ('"' + parameters + '"') : '');
		} else {
			ref_parameters = parameters;
		}
	} else {
		ref_parameters = '';
	}
	
	// Make BridgeTalk message:
	bt = new BridgeTalk;
	bt.target = 'illustrator';
	msg = (eval(fun_name) + '\r ' + fun_name + '(' + ref_parameters + ');');
	bt.body = msg;
	bt.send();
	
};

// Get function name (use target function name without brackets):
var getFunctionName = function(fun_name) {
	var ret = fun_name.toString();
	ret = ret.substr('function '.length);
	ret = ret.substr(0, ret.indexOf('('));
	return ret;
};

// Your function:
function myFunction(parameter) {
	
	$.writeln(parameter);
    $.writeln(doc.layers.length);
	
}

// GUI constructor:
NS = new Function('this.windowRef = null;');

// GUI window:
NS.prototype.run = function() {
	
	var win;
	var myListbox;
	var myButton;
	
	// Main window:
	win = new Window('palette', TITLE, undefined, { resizeable: true });
	win.orientation = 'column';
	win.alignChildren = ['fill', 'fill'];
	
	// If need to update the window, like `onClick`, use: `win.layout.layout(true);`.
	win.onResizing = function() { this.layout.resize(); };
	win.onShow = function() { win.layout.resize(); }
	
	// Listbox:
	myListbox = win.add ('listbox', undefined, ['Text', 2], {
		numberOfColumns: 1,
		showHeaders: true,
		columnTitles: ['Values']
	});
	
	// Button:
	myButton = win.add('button', undefined, 'What Value?');
	myButton.onClick = function() {
		btMsg(getFunctionName(myFunction), myListbox.selection.text);
	}
	
	// Close button:
	win.btnQuit = win.add('button', undefined, 'Close');
	win.btnQuit.onClick = function() { win.close(); }
	
	// Window Lauch Properties:
	win.center();
	win.show();
	
}

new NS().run();

$.writeln('finished');
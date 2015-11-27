/**
 * @see https://gist.github.com/mhulse/aac5d6782868b612320b
 * @see https://gist.github.com/mhulse/eb0ffb2bd365975632d2
 */

var STUB = (function(stub, app, title, undefined) {
	
	'use strict';
	
	var _title;
	var _doc;
	var _main;
	
	stub.init = function($title) {
		
		if (app.documents.length > 0) {
			
			_title = $title;
			_doc = app.activeDocument;
			
			_main(); // Only run if there's at least one document open.
			
		} else {
			
			Window.alert('You must open at least one document.');
			
		}
		
	};
	
	_main = function() {
		
		$.writeln(_doc.layers.length);
		$.writeln(_title);
		
	}
	
	//var NS = 'FOO';
	//var TITLE = 'Test';
	//var doc = app.activeDocument; // Just to show that this can be here ...
	
	/*
	// Need this for production:
	if (app.documents.length > 0) {
		doc = app.activeDocument;
		if ( ! doc.saved) {
			Window.alert('This script needs to modify your document. Please save it before running this script.');
		} else {
			init(); // Only run if there's at least one document open.
		}
	} else {
		Window.alert('You must open at least one document.');
	}
	*/
	
	/*
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
	*/
	
	/*
	var createPalette = function() {
		
		// Controls width of palette window and children UI elements:
		//var size = 200;
		// Palette box setup:
		var meta = [
			'palette {',
				//'preferredSize: [200, ""],',
				'text: ' + TITLE + ',',
				//'_time: EditText { text: "150", },',
				'group: Group {',
					'panel: Panel {',
						//'preferredSize: [' + size + ', ""],',
						'alignChildren: "left",',
						'_down: RadioButton { text: "Top down", value: "true", },',
						'_up: RadioButton { text: "Bottom up", },',
						'_pong: Checkbox { text: "Ping pong", value: "true", },',
					'},',
				'},',
				'_start: Button { text: "Start" },',
				'_close: Button { text: "Close" },',
			'};'
		].join('\n');
		
		// Instanciate `Window` class with setup from above:
		var palette = new Window(meta);
		
		// Not sure if this works:
		palette.resizeable = true;
		
		// Button:
		palette._start.onClick = function() {
			btm(getFunctionName(myFunction));
		}
		
		// Listbox:
		myListbox = win.add('listbox', undefined, ['Text', 2], {
			numberOfColumns: 1,
			showHeaders: true,
			columnTitles: ['Values']
		});
		
		// Button:
		myButton = win.add('button', undefined, 'What Value?');
		myButton.onClick = function() {
			btm(getFunctionName(myFunction), myListbox.selection.text);
		}
		
		// Close button:
		win.btnQuit = win.add('button', undefined, 'Close');
		win.btnQuit.onClick = function() { win.close(); }
		
		//palette.orientation = 'column';
		//palette.alignChildren = ['fill', 'fill'];
		
		// Time input box:
		//palette._time.active = true;
		//palette._time.alignment = 'fill';
		
		// Start button:
		//palette._start.onClick = anim;
		palette._start.alignment = 'fill';
		
		// Close button:
		palette._close.onClick = function() {
			palette.close();
		};
		palette._close.alignment = 'fill';
		
		palette.onShow = function() {
			palette.location.y = 150; // Adjust window so it's not in the center of the screen.
			palette.layout.resize();
		};
		
		// If need to update the window, like `onClick`, use: `win.layout.layout(true);`.
		palette.onResizing = function() { this.layout.resize(); };
		//palette.onShow = function() { win.layout.resize(); }
		
		// Show the palette window:
		//palette.show();
		
		return palette;
		
	}
	
	// Your function:
	function myFunction(parameter) {
		
		$.writeln(parameter);
		$.writeln(doc.layers.length); // ... and called from here.
		
	}
	
	// GUI constructor:
	//NS = new Function('this.windowRef = null;');
	
	// GUI window:
	NS.prototype.run = function() {
		
		var win;
		var myListbox;
		var myButton;
		
		// Main window:
		//win = new Window('palette', TITLE, undefined, { resizeable: true });
		win = createPalette();
		
		// Window Lauch Properties:
		win.center();
		win.show();
		
	}
	*/
	
	//new NS().run();
	
	//$.writeln('finished');
	
	return stub;
	
}((STUB || {}), app));

#target illustrator
#targetengine main

STUB.init('Test');
//STUB.public_func('baz');
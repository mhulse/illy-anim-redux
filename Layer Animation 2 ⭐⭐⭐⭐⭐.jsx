#target illustrator
#targetengine main

/**
 * @see https://gist.github.com/mhulse/aac5d6782868b612320b
 * @see https://gist.github.com/mhulse/eb0ffb2bd365975632d2
 */

var ANIM2 = (function($ns, $app, undefined) {
	
	'use strict';
	
	var _title;
	var _doc;
	var _main;
	var _btm;
	var _func;
	var _palette;
	
	$ns.init = function($title) {
		
		if ($app.documents.length > 0) {
			
			_title = $title;
			_doc = $app.activeDocument;
			
			_main(); // Only run if there's at least one document open.
			
		} else {
			
			Window.alert('You must open at least one document.');
			
		}
		
	};
	
	_main = function() {
		
		var palette;
		
		// Main window:
		//win = new Window('palette', TITLE, undefined, { resizeable: true });
		palette = createPalette();
		
		// Window Lauch Properties:
		palette.center();
		palette.show();
		
		$.writeln(_doc.layers.length);
		$.writeln(_title);
		
	};
	
	// BridgeTalk message:
	_btm = function($name, $params) {
		
		var params;
		var button;
		var message;
		
		// Test type of params:
		if ($params != undefined) {
			if ((typeof $params == 'string') || ($params instanceof String)) {
				params = (($params != undefined) ? ('"' + $params + '"') : '');
			} else {
				params = $params;
			}
		} else {
			params = '';
		}
		
		// Make BridgeTalk message:
		button = new BridgeTalk;
		button.target = 'illustrator';
		message = (eval($name) + '\r ' + $name + '(' + params + ');');
		button.body = message;
		button.send();
		
	};
	
	// Get function name (use target function name without brackets):
	_func = function($name) {
		
		var ret = $name.toString();
		
		ret = ret.substr('function '.length);
		ret = ret.substr(0, ret.indexOf('('));
		
		return ret;
		
	};
	
	_palette = function() {
		
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
		// palette.resizeable = true;
		
		// Button:
		palette._start.onClick = function() {
			btm(getFunctionName(myFunction));
		}
		
		// Listbox:
		// myListbox = win.add('listbox', undefined, ['Text', 2], {
		// 	numberOfColumns: 1,
		// 	showHeaders: true,
		// 	columnTitles: ['Values']
		// });
		
		// Button:
		// myButton = win.add('button', undefined, 'What Value?');
		// myButton.onClick = function() {
		// 	btm(getFunctionName(myFunction), myListbox.selection.text);
		// }
		
		// Close button:
		// win.btnQuit = win.add('button', undefined, 'Close');
		// win.btnQuit.onClick = function() { win.close(); }
		
		//palette.orientation = 'column';
		// palette.alignChildren = ['fill', 'fill'];
		
		// Time input box:
		// palette._time.active = true;
		// palette._time.alignment = 'fill';
		
		// Start button:
		// palette._start.onClick = anim;
		palette._start.alignment = 'fill';
		
		// Close button:
		palette._close.onClick = function() {
			palette.close();
		};
		palette._close.alignment = 'fill';
		
		// palette.onShow = function() {
		// 	palette.location.y = 150; // Adjust window so it's not in the center of the screen.
		// 	palette.layout.resize();
		// };
		
		// If need to update the window, like `onClick`, use: `win.layout.layout(true);`.
		// palette.onResizing = function() { this.layout.resize(); };
		// palette.onShow = function() { win.layout.resize(); }
		
		// Show the palette window:
		// palette.show();
		
		return palette;
		
	};
	
	// Your function:
	function myFunction($param) {
		
		$.writeln($param);
		$.writeln(_doc.layers.length);
		
	}
	
	return $ns;
	
}((ANIM2 || {}), app));

ANIM2.init('Test');

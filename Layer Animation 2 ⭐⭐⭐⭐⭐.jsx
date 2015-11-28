#target illustrator
#targetengine main

/**
 * @see https://gist.github.com/mhulse/aac5d6782868b612320b
 * @see https://gist.github.com/mhulse/eb0ffb2bd365975632d2
 */

var NS = 'ANIM2';

this[NS] = (function($this, $application, $window, undefined) {
	
	'use strict';
	
	var _title;
	var _doc;
	var _main;
	var _btm;
	var _palette;
	
	$this.init = function($title) {
		
		if ($application.documents.length > 0) {
			
			_title = $title;
			_doc = $application.activeDocument;
			
			_main(); // Only run if there's at least one document open.
			
		} else {
			
			$window.alert('You must open at least one document.');
			
		}
		
	};
	
	// Your function:
	$this.myFunction = function($param) {
		
		$.writeln('myFunction', $param, _doc.layers.length);
		
	};
	
	_main = function() {
		
		var palette;
		
		palette = _palette();
		palette.center();
		palette.show();
		
	};
	
	// BridgeTalk message:
	_btm = function($name, $params) {
		
		var params;
		var talk;
		
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
		talk = new BridgeTalk;
		talk.target = 'illustrator';
		talk.body = (NS + '.' + $name + '(' + params + ');');
		talk.send();
		
	};
	
	_palette = function() {
		
		// Controls width of palette window and children UI elements:
		var size = 200;
		
		// Palette box setup:
		var meta = [
			'palette {',
				'preferredSize: [200, ""],',
				'text: ' + _title + ',',
				// '_time: EditText { text: "150", },',
				// 'group: Group {',
				// 	'panel: Panel {',
				// 		'preferredSize: [' + size + ', ""],',
				// 		'alignChildren: "left",',
				// 		'_down: RadioButton { text: "Top down", value: "true", },',
				// 		'_up: RadioButton { text: "Bottom up", },',
				// 		'_pong: Checkbox { text: "Ping pong", value: "true", },',
				// 	'},',
				// '},',
				'_start: Button { text: "Start" },',
				'_close: Button { text: "Close" },',
			'};'
		].join('\n');
		
		// Instanciate `Window` class with setup from above:
		var palette = new Window(meta);
		
		// Start button:
		palette._start.onClick = function() {
			
			$.writeln('onClick');
			
			_btm('myFunction', 'foo');
			
		}
		palette._start.alignment = 'fill';
		
		// Close button:
		palette._close.onClick = function() {
			
			palette.close();
			
		};
		palette._close.alignment = 'fill';
		
		return palette;
		
	};
	
	return $this;
	
}((this[NS] || {}), app, Window));

this[NS].init('Test');

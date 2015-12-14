/* globals $, app, BridgeTalk */

#target illustrator
#targetengine main

/**
 * @see https://gist.github.com/mhulse/aac5d6782868b612320b
 * @see https://gist.github.com/mhulse/eb0ffb2bd365975632d2
 */

var NS = 'ANIM2';

this[NS] = (function($this, $application, $window, undefined) {
	
	'use strict';
	
	//----------------------------------------------------------------------
	// Private variables:
	//----------------------------------------------------------------------
	
	var _title;
	var _doc;
	var _main;
	var _btm;
	var _palette;
	var _sanitize;
	var _focus;
	var _filter;
	var _activate;
	var _anim;
	var _up;
	var _down;
	var _control;
	
	//----------------------------------------------------------------------
	// Public methods:
	//----------------------------------------------------------------------
	
	/**
	 * Constructor.
	 *
	 * @param  {string} $title Title of palette window.
	 * @return {void}
	 */
	
	$this.init = function($title) {
		
		if ($application.documents.length > 0) {
			
			_title = $title;
			_doc = $application.activeDocument;
			
			_main(); // Only run if there's at least one document open.
			
		} else {
			
			$window.alert('You must open at least one document.');
			
		}
		
	};
	
	// Test input function:
	$this.input = function($param1, $param2) {
		
		//$.writeln($param1, $param2);
		//$.writeln('myFunction', _doc.layers.length, _doc.activeLayer);
		
		_focus(true);
		
		return 'foo';
		
	};
	
	// Test output function:
	$this.output = function($result, $arg1, $arg2) {
		
		//$.writeln('result', $result.body, $arg1, $arg2);
		
	};
	
	//----------------------------------------------------------------------
	// Private methods:
	//----------------------------------------------------------------------
	
	/**
	 * Internal init/constructor.
	 *
	 * @return {void}
	 */
	
	_main = function() {
		
		var palette;
		
		_focus();
		
		palette = _palette();
		palette.center();
		palette.show();
		
	};
	
	/**
	 * BridgeTalk message.
	 *
	 * @param  {string} $name1   BridgeTalk input function.
	 * @param  {array}  $params1 BridgeTalk input function parameters (array values will be converted to strings).
	 * @param  {string} $name2   BridgeTalk output function.
	 * @param  {array}  $params2 BridgeTalk output function parameters.
	 * @return {void}
	 */
	
	_btm = function($name1, $params1, $name2, $params2) {
		
		var talk;
		
		if ($name1 !== undefined) {
			
			$params1 = _sanitize($params1); // Arguments must be converted to strings.
			
			// Make BridgeTalk message:
			talk = new BridgeTalk();
			talk.target = 'illustrator';
			talk.body = (NS + '.' + $name1 + '.apply(null, [' + $params1 + ']);');
			
			if ($name2 !== undefined) {
				
				talk.onResult = function($result) {
					
					$params2.unshift($result); // Must be unshifted outside of function call (i.e., can't be inline with arguments).
					
					$this[$name2].apply(null, $params2);
					
				};
				
			}
			
			talk.send();
			
		}
		
	};
	
	/**
	 * Create palette window.
	 *
	 * @return {window} Illustrator Window object.
	 */
	
	_palette = function() {
		
		// Palette box setup:
		var meta = 'palette { \
			orientation: "row", \
			preferredSize: [300, 130], \
			alignChildren: ["fill", "top"], \
			margins: 10, \
			group1: Group { \
				orientation: "column", \
				_down: RadioButton { text: "Down", value: "true", }, \
				_up: RadioButton { text: "Up", }, \
				_pong: Checkbox { text: "Ping pong", value: "true", }, \
				_label1: StaticText { text: "Frames before:" }, \
				_before: EditText { text: "1", justify: "left" }, \
				_label2: StaticText { text: "Frames after:" }, \
				_after: EditText { text: "1", justify: "left" }, \
			}, \
			group2: Group { \
				orientation: "column", \
				preferredSize: [100, undefined], \
				_start: Button { text: "Start" }, \
				_close: Button { text: "Close" }, \
			} \
		}';
		
		// Instanciate `Window` class with setup from above:
		var palette = new Window(meta, _title, undefined, {
			resizeable: true
		});
		
		// Start button:
		palette.group2._start.onClick = function() {
			
			//$.writeln('onClick');
			
			var param = 'baz';
			
			_btm(
				'input',          // Queries target application and returns a result.
				[param, 'donny'], // Parameters, as array, to pass `input` function.
				'output',         // Callback function, called upon successful `BridgeTalk` communication.
				[param, 'billy']  // Parameters, as array, to pass `output` function.
			);
			
		};
		palette.group2._start.alignment = 'fill';
		
		// Close button:
		palette.group2._close.onClick = function() {
			
			palette.close();
			
		};
		palette.group2._close.alignment = 'fill';
		
		// onResize needed on Mac OS X:
		palette.onResizing = palette.onResize = palette.onShow = function() { this.layout.resize(); } // If need to update the window, like `onClick`, use: `win.layout.layout(true);`.
		
		return palette;
		
	};
	
	/**
	 * Convert array to quoted strings delimited with comma.
	 *
	 * @param  {array}  $array Array to be "sanitized".
	 * @return {string}        String value of sanitized array.
	 */
	
	_sanitize = function($array) {
		
		return (($array.length === 0) ? '' : ('"' + $array.join('","') + '"'));
		
	};
	
	/**
	 * Show "active" layer, hide everything else.
	 *
	 * @return {void}
	 */
	
	_focus = function($next) {
		
		var filtered = _filter();
		var layers = filtered.layers;
		var layer;
		var active = filtered.active;
		
		// Do we need to show the next layer in list?
		$next = (( !! $next) || false); // If `false`, just deal with the "active" layer.
		
		// Loop over layers:
		for (layer in layers) {
			
			// Hide everything:
			layers[layer].visible = false;
			
		}
		
		// Loop endlessly:
		($next && active = (((active + 1) < layers.length) ? (active + 1) : 0));
		
		// Show the designated "active" layer:
		layers[active].visible = true;
		
		// ... and mark it as "activeLayer":
		_doc.activeLayer = layers[active];
		
		// Probably not needed, but can't hurt:
		$application.redraw();
		
	};
	
	/**
	 * Get all top-level, non-template, and unlocked layers.
	 *
	 * @return {array} Filtered set of active document layers.
	 */
	
	_filter = function() {
		
		var result = {};
		var layer;
		var i;
		var il;
		var count = 0; // Stores the "active" layer key number.
		
		// Initialize:
		result.active = 0;
		result.layers = []
		
		// Loop over layers:
		for (i = 0, il = _doc.layers.length; i < il; i++) {
			
			// Current layer object in loop:
			layer = _doc.layers[i];
			
			// Skip template and locked layers:
			if (layer.printable && (layer.locked == false)) { // Template layers are not "printable".
				
				// If it's a part of the non-template and unlocked layers, record the active layer index:
				((layer === _doc.activeLayer) && (result.active = count));
				
				// Since we're looping backwards, add layer object to front of return object:
				result.layers.push(layer);
				
				// Up the count for use in the next loop iteration:
				count++;
				
			}
			
		}
		
		return result;
		
	}
	
	//----------------------------------------------------------------------
	// Pending functions:
	//----------------------------------------------------------------------
	
	/*
	_anim = function() {
		
		var count = doc.layers.length;
		var radios = dialog.group.panel;
		var pong = radios._pong.value;
		var i;
		
		// Hide all layers:
		clean();
		
		// http://stackoverflow.com/a/3586329/922323
		if ( ! radios._up.value) { // Top down or bottom up?
			up(count);
			pong && down(count - 1);
		} else {
			down(count);
			pong && up(count, 1);
		}
		
		// Restore visibility of layers before script was ran:
		clean(true);
		
	};
	
	_up = function(count, start) {
		
		// Default function param:
		start = start || 0;
		
		for (start; start < count; start++) {
			control(start); // Count up!
		}
		
	};
	
	_down = function(count) {
		
		while (count--) {
			control(count); // Count down!
		}
		
	};
	
	_control = function(i) {
		
		var layers = doc.layers;
		var current;
		var previous;
		
		// Skip template layers:
		if (layers[i].printable) {
			
			// Current layer:
			current = layers[i];
			
			// Cache the current layer so we can turn it off in the next loop:
			previous = current;
			
			// Show the current layer:
			current.visible = true;
			
			// Pause the looping to control "frame rate" of "animation":
			$.setTimeout('redraw', Number(dialog._time.text)); // `EditText` control accepts just text.
			
			// We're moving on, hide the layer in preparation for the next loop:
			previous.visible = false;
			
		}
		
	};
	*/
	
	//----------------------------------------------------------------------
	// Return public API:
	//----------------------------------------------------------------------
	
	return $this;
	
}((this[NS] || {}), app, Window));


//----------------------------------------------------------------------
// Initialize plugin:
//----------------------------------------------------------------------

this[NS].init('Test');

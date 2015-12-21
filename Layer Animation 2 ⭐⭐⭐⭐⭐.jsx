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
	
	var _private = {};
	var _doc = null;
	var _ref = null;
	var _title = '';
	
	//----------------------------------------------------------------------
	// Private methods:
	//----------------------------------------------------------------------
	
	/**
	 * Internal init/constructor.
	 *
	 * @return {void}
	 */
	
	_private.main = function() {
		
		_ref = _private.palette();
		_ref.center();
		_ref.show();
		
		_private.focus();
		
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
	
	_private.btm = function($name1, $params1, $name2, $params2) {
		
		var talk;
		
		if ($name1 !== undefined) {
			
			$params1 = _private.sanitize($params1); // Arguments must be converted to strings.
			
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
	
	_private.palette = function() {
		
		// Palette box setup:
		var meta = 'palette { \
			orientation: "column", \
			alignChildren: ["fill", "top"], \
			preferredSize: [300, 130], \
			margins: 15, \
			group1: Group { \
				orientation: "row", \
				$$down: RadioButton { text: "Top down", value: "true" }, \
				$$up: RadioButton { text: "Bottom up" }, \
				$$pong: Checkbox { text: "Ping pong" } \
			}, \
			$$start: Button { text: "Start" }, \
			$$close: Button { \
				text: "Close", \
				alignment: [ \
					"right", \
					"center" \
				] \
			} \
		}';
		
		// Instanciate `Window` class with setup from above:
		var palette = new Window(meta, _title, undefined, {
			resizeable: true
		});
		
		// Start button:
		palette.$$start.onClick = function() {
			
			//$.writeln('onClick');
			
			var param = 'baz';
			
			_private.btm(
				'input',          // Queries target application and returns a result.
				[param, 'donny'], // Parameters, as array, to pass `input` function.
				'output',         // Callback function, called upon successful `BridgeTalk` communication.
				[param, 'billy']  // Parameters, as array, to pass `output` function.
			);
			
		};
		//palette.$$start.alignment = 'fill';
		
		// Close button:
		palette.$$close.onClick = function() {
			
			palette.close();
			
		};
		//palette.$$close.alignment = 'fill';
		
		// onResize needed on Mac OS X:
		palette.onResizing = palette.onResize = palette.onShow = function() { this.layout.resize(); } // If need to update the window, like `onClick`, use: `win.layout.layout(true);`.
		
		return palette;
		
	};
	
	/**
	 * Convert array to quoted strings delimited with comma.
	 *
	 * @param  {array}  $array Array to be "sanitized".
	 * @return {string} String value of sanitized array.
	 */
	
	_private.sanitize = function($array) {
		
		return (($array.length === 0) ? '' : ('"' + $array.join('","') + '"'));
		
	};
	
	/**
	 * Show "active" layer, hide everything else.
	 *
	 * @return {void}
	 */
	
	_private.focus = function($next) {
		
		var radios = _ref.group1;
		var filtered = _private.filter();
		var layers = filtered.layers;
		var count = layers.length;
		var layer;
		var active = filtered.active;
		var method;
		
		// Do we need to show the next layer in list?
		$next = (( !! $next) || false); // If `false`, just deal with the "active" layer.
		
		// Loop over layers:
		for (layer in layers) {
			
			// Hide everything:
			layers[layer].visible = false;
			
		}
		
		if ($next) {
			
			if (radios.$$pong.value) {
				
				if (active == 0) {
					
					radios.$$down.value = true;
					
				}
				
				if ((active + 1) == count) {
					
					radios.$$up.value = true;
					
				}
				
			}
			
			// Going up or down?
			method = (radios.$$down.value) ? 'down' : 'up';
			
			// Animate:
			active = _private[method](active, count);
			
		}
		
		// Show the designated "active" layer:
		layers[active].visible = true;
		
		// ... and mark it as "activeLayer":
		_doc.activeLayer = layers[active];
		
		// Probably not needed, but can't hurt:
		$application.redraw();
		
	};
	
	_private.down = function($active, $count) {
		
		return ((($active + 1) < $count) ? ($active + 1) : 0);
		
	};
	
	_private.up = function($active, $count) {
		
		return ((($active - 1) < 0) ? ($count - 1) : ($active - 1));
		
	};
	
	/**
	 * Get all top-level, non-template, and unlocked layers.
	 *
	 * @return {array} Filtered set of active document layers.
	 */
	
	_private.filter = function() {
		
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
				
				// Add layer object to end of return object:
				result.layers.push(layer);
				
				// Up the count for use in the next loop iteration:
				count++;
				
			}
			
		}
		
		return result;
		
	};
	
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
			
			_private.main(); // Only run if there's at least one document open.
			
		} else {
			
			$window.alert('You must open at least one document.');
			
		}
		
	};
	
	// Test input function:
	$this.input = function($param1, $param2) {
		
		//$.writeln($param1, $param2);
		//$.writeln('myFunction', _doc.layers.length, _doc.activeLayer);
		
		_private.focus(true);
		
		return 'foo';
		
	};
	
	// Test output function:
	$this.output = function($result, $arg1, $arg2) {
		
		//$.writeln('result', $result.body, $arg1, $arg2);
		
	};
	
	//----------------------------------------------------------------------
	// Return public API:
	//----------------------------------------------------------------------
	
	return $this;
	
}((this[NS] || {}), app, Window));


//----------------------------------------------------------------------
// Initialize plugin:
//----------------------------------------------------------------------

this[NS].init('Test');

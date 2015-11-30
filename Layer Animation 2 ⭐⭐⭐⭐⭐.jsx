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
		
		// Controls width of palette window and children UI elements:
		var size = 200;
		
		// Palette box setup:
		var meta = 'palette { \
			preferredSize: [' + size + ', ""], \
			text: "' + _title + '", \
			_start: Button { text: "Start" }, \
			_close: Button { text: "Close" }, \
		}';
		
		// Instanciate `Window` class with setup from above:
		var palette = new Window(meta);
		
		// Start button:
		palette._start.onClick = function() {
			
			//$.writeln('onClick');
			
			var param = 'baz';
			
			_btm(
				'input',          // Queries target application and returns a result.
				[param, 'donny'], // Parameters, as array, to pass `input` function.
				'output',         // Callback function, called upon successful `BridgeTalk` communication.
				[param, 'billy']  // Parameters, as array, to pass `output` function.
			);
			
		};
		palette._start.alignment = 'fill';
		
		// Close button:
		palette._close.onClick = function() {
			
			palette.close();
			
		};
		palette._close.alignment = 'fill';
		
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
	
	_focus = function() {
		
		var i;
		var l;
		
		for (i = 0, l = _doc.layers.length; i < l; i++) {
			
			_doc.layers[i].visible = false;
			
		}
		
		_doc.activeLayer.visible = true;
		
	}
	
	//----------------------------------------------------------------------
	// Return public API:
	//----------------------------------------------------------------------
	
	return $this;
	
}((this[NS] || {}), app, Window));


//----------------------------------------------------------------------
// Initialize plugin:
//----------------------------------------------------------------------

this[NS].init('Test');

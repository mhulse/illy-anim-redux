/* jshint -W043, laxbreak:true, -W030 */
/* globals app, BridgeTalk, UserInteractionLevel */

// jshint ignore:start
#target illustrator
#targetengine main
// jshint ignore:end

/**
 * @@@BUILDINFO@@@ Layer Animation II.jsx !Version! Fri Dec 25 2015 22:47:45 GMT-0800
 *
 * @see https://gist.github.com/mhulse/aac5d6782868b612320b
 * @see https://gist.github.com/mhulse/eb0ffb2bd365975632d2
 */

var NS = 'ANIM2';

this[NS] = (function(_$this, _$application, _$window, undefined) {
	
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
	 * Boilerplate used to create a “BridgeTalk Message”.
	 *
	 * @param  {string} $name1   BridgeTalk input function.
	 * @param  {array}  $params1 BridgeTalk input function parameters (array values will be converted to strings).
	 * @param  {string} $name2   BridgeTalk output function.
	 * @param  {array}  $params2 BridgeTalk output function parameters.
	 * @return {void}
	 */
	
	_private.btm = function($name1, $params1, $name2, $params2) {
		
		var talk;
		
		// Some defaults:
		$params1 = ($params1 instanceof Array) ? $params1 : [];
		$params2 = ($params2 instanceof Array) ? $params2 : [];
		
		if ($name1 !== undefined) {
			
			$params1 = _private.sanitize($params1); // Arguments must be converted to strings.
			
			// Make BridgeTalk message:
			talk = new BridgeTalk();
			talk.target = 'illustrator';
			talk.body = (NS + '.' + $name1 + '.apply(null, [' + $params1 + ']);');
			
			if ($name2 !== undefined) {
				
				talk.onResult = function($result) {
					
					$params2.unshift($result); // Must be unshifted outside of function call (i.e., can't be inline with arguments in call to `apply()` below).
					
					_$this[$name2].apply(null, $params2);
					
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
			margins: 15, \
			group1: Group { \
				orientation: "row", \
				$$down: RadioButton { text: "Top down", value: "true" }, \
				$$up: RadioButton { text: "Bottom up" }, \
				$$pong: Checkbox { text: "Ping pong" } \
				$$selected: Checkbox { text: "Use selected" } \
			}, \
			group2: Group { \
				alignChildren: ["fill", "top"], \
				orientation: "row", \
				$$start: Button { text: "Start" }, \
				$$close: Button { text: "Close" } \
			} \
		}';
		
		// Instanciate `Window` class with setup from above:
		var palette = new Window(meta, _title, undefined, {
			//option: value
		});
		
		// Selected checkbox:
		palette.group1.$$selected.onClick = function() {
			
			// If checked, load, otherwise, unload the temporary action file:
			(this.value) ? _private.load() : _private.unload();
			
		};
		
		// Start button:
		palette.group2.$$start.onClick = function() {
			
			// For more options, see: https://gist.github.com/mhulse/efd706ab3252b9cb6a25
			_private.btm('update'); // Queries target application and returns a result.
			
		};
		
		// Close and/or palette UI close buttons:
		palette.group2.$$close.onClick = palette.onClose = function() {
			
			// Make sure to clean up actions:
			_private.unload();
			
			palette.close();
			
		};
		
		return palette;
		
	};
	
	/**
	 * Convert array to quoted strings delimited with comma.
	 *
	 * @param {array} $array Array to be "sanitized".
	 * @return {string} String value of sanitized array.
	 */
	
	_private.sanitize = function($array) {
		
		// If not an array, or if array is empty, then return an empty string. Otherwise, return quoted strings:
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
		var active = filtered.active;
		var layers = filtered.layers;
		var count = layers.length;
		var layer;
		var method;
		
		// Do we need to show the next layer in list?
		$next = (( !! $next) || false); // If `false`, just deal with the "active" layer.
		
		// Loop over layers:
		for (layer in layers) {
			
			// https://jslinterrors.com/the-body-of-a-for-in-should-be-wrapped-in-an-if-statement
			if (layers.hasOwnProperty(layer)) {
				
				// Hide everything:
				layers[layer].visible = false;
				
			}
			
		}
		
		// Next layer?
		if ($next) {
			
			// Pong?
			if (radios.$$pong.value) {
				
				// Going down?
				if (active === 0) {
					
					// Yup, so select the palette's "down" radio button:
					radios.$$down.value = true;
					
				}
				
				// Going up?
				if ((active + 1) == count) {
					
					// Select the "up" radio button:
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
		_$application.redraw();
		
	};
	
	/**
	 * Determine "downwards" layer to show.
	 *
	 * @param {integer} $active Key of active layer.
	 * @param {integer} $count Layer length.
	 * @return {integer} Key of layer to show.
	 */
	
	_private.down = function($active, $count) {
		
		return ((($active + 1) < $count) ? ($active + 1) : 0);
		
	};
	
	/**
	 * Determine "upwards" layer to show.
	 *
	 * @param {integer} $active Key of active layer.
	 * @param {integer} $count Layer length.
	 * @return {integer} Key of layer to show.
	 */
	
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
		var selected = _ref.group1.$$selected.value;
		
		if (selected) {
			
			// Make all selected layers visible and hide the rest:
			_private.run();
			
		}
		
		// Initialize:
		result.active = 0;
		result.layers = [];
		
		// Loop over layers:
		for (i = 0, il = _doc.layers.length; i < il; i++) {
			
			// Current layer object in loop:
			layer = _doc.layers[i];
			
			// Skip template and locked layers:
			if (
				layer.printable // Template layers are not "printable".
				&&
				( ! layer.locked)
				&&
				(
					(selected ? layer.visible : true) // Only check for visibility if `selected` is true.
				)
			) {
				
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
	
	_private.load = function() {
		
		// Action string:
		var action = [
			'/version 3',
			'/name [',
				'4', // Group name character count.
				'74656d70', // Group name as a hash.
			']',
			'/isOpen 0',
			'/actionCount 1',
			'/action-1 {',
				'/name [',
					'4', // Action name character count.
					'74656d70', // Action name as a hash.
				']',
				'/keyIndex 0',
				'/colorIndex 0',
				'/isOpen 0',
				'/eventCount 1',
				'/event-1 {',
					'/useRulersIn1stQuadrant 0',
					'/internalName (ai_plugin_Layer)',
					'/localizedName [',
						'5',
						'4c61796572',
					']',
					'/isOpen 0',
					'/isOn 1',
					'/hasDialog 0',
					'/parameterCount 3',
					'/parameter-1 {',
						'/key 1836411236',
						'/showInPalette -1',
						'/type (integer)',
						'/value 7',
					'}',
					'/parameter-2 {',
						'/key 1937008996',
						'/showInPalette -1',
						'/type (integer)',
						'/value 23',
					'}',
					'/parameter-3 {',
						'/key 1851878757',
						'/showInPalette -1',
						'/type (ustring)',
						'/value [',
							'11',
							'48696465204f7468657273',
						']',
					'}',
				'}',
			'}'
		].join('\n');
		
		// Create and load:
		_private.create(action);
		
	};
	
	/**
	 * Create action file and load it into the actions palette.
	 *
	 * @param {string} $action Action string to create and load.
	 * @return {void}
	 */
	
	_private.create = function($action) {
		
		var aia = new File('~/temp.aia'); // Temporary file created in home directory.
		
		// Open and write the action string:
		aia.open('w');
		aia.write($action);
		aia.close();
		
		// Load action into actions palette:
		_$application.loadAction(aia);
		
		// Remove the temporary file:
		aia.remove();
		
	};
	
	/**
	 * Removes action from actions palette.
	 *
	 * @return {void}
	 */
	
	_private.unload = function() {
		
		_$application.unloadAction('temp', ''); // Action Set Name.
		
	};
	
	/**
	 * Runs temporary layer action.
	 *
	 * @return {void}
	 */
	
	_private.run = function() {
		
		var level = _$application.userInteractionLevel; // Gets the current user interaction level.
		var i;
		var il;
		
		// Overrides the current user interaction level:
		_$application.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;
		
		// Action requires all layers to be visible before it can function:
		for (i = 0, il = _doc.layers.length; i < il; i++) {
			
			// Make all layers visible:
			_doc.layers[i].visible = true;
			
		}
		
		// Run the temporary action:
		_$application.doScript('temp', 'temp', false); // Action Name, Action Set Name.
		
		// Restore the user interaction level:
		_$application.userInteractionLevel = level;
		
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
	
	_$this.init = function($title) {
		
		// Open document(s)?
		if (_$application.documents.length > 0) {
			
			// Yup, so setup local globals:
			_title = $title;
			_doc = _$application.activeDocument;
			
			// Begin the program:
			_private.main(); // Only run if there's at least one document open.
			
		} else {
			
			// Nope, let the user know what they did wrong:
			_$window.alert('You must open at least one document.');
			
		}
		
	};
	
	/**
	 * Re-starts script (called from BridgeTalk).
	 *
	 * @return {void}
	 */
	
	_$this.update = function() {
		
		_private.focus(true);
		
	};
	
	//----------------------------------------------------------------------
	// Return public API:
	//----------------------------------------------------------------------
	
	return _$this;
	
}((this[NS] || {}), app, Window));


//----------------------------------------------------------------------
// Initialize plugin:
//----------------------------------------------------------------------

this[NS].init('Animate Layers II'); // Begin program and pass title of palette.

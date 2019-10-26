// From https://gomakethings.com/vanilla-javascript-version-of-jquery-extend/
const extend = function() {
	let extended = {},
		deep = false,
		i = 0,
		length = arguments.length;

	// Check if a deep merge
	if (Object.prototype.toString.call(arguments[0]) === "[object Boolean]") {
		deep = arguments[0];
		i++;
	}

	// Merge the object into the extended object
	const merge = function(obj) {
		for (let prop in obj) {
			if (Object.prototype.hasOwnProperty.call(obj, prop)) {
				// If deep merge and property is an object, merge properties
				if (
					deep &&
					Object.prototype.toString.call(obj[prop]) === "[object Object]"
				) {
					extended[prop] = extend(true, extended[prop], obj[prop]);
				} else {
					extended[prop] = obj[prop];
				}
			}
		}
	};

	// Loop through each object and conduct a merge
	for (; i < length; i++) {
		merge(arguments[i]);
	}
	return extended;
};

// From https://github.com/epoberezkin/fast-deep-equal
const isDeepEqual = function(a, b) {
	if (a === b) return true;

	let arrA = Array.isArray(a),
		arrB = Array.isArray(b),
		i;

	if (arrA && arrB) {
		if (a.length != b.length) return false;
		for (i = 0; i < a.length; i++) if (!isDeepEqual(a[i], b[i])) return false;
		return true;
	}

	if (arrA != arrB) return false;

	if (a && b && typeof a === "object" && typeof b === "object") {
		let keys = Object.keys(a);
		if (keys.length !== Object.keys(b).length) return false;

		let dateA = a instanceof Date,
			dateB = b instanceof Date;
		if (dateA && dateB) return a.getTime() == b.getTime();
		if (dateA != dateB) return false;

		let regexpA = a instanceof RegExp,
			regexpB = b instanceof RegExp;
		if (regexpA && regexpB) return a.toString() == b.toString();
		if (regexpA != regexpB) return false;

		for (i = 0; i < keys.length; i++)
			if (!Object.prototype.hasOwnProperty.call(b, keys[i])) return false;

		for (i = 0; i < keys.length; i++)
			if (!isDeepEqual(a[keys[i]], b[keys[i]])) return false;
		return true;
	}
	return false;
};

// From https://github.com/niksy/throttle-debounce
/**
 * Throttle execution of a function. Especially useful for rate limiting
 * execution of handlers on events like resize and scroll.
 *
 * @param  {Number}    delay          A zero-or-greater delay in milliseconds. For event callbacks, values around 100 or 250 (or even higher) are most useful.
 * @param  {Boolean}   noTrailing     Optional, defaults to false. If noTrailing is true, callback will only execute every `delay` milliseconds while the
 *                                    throttled-function is being called. If noTrailing is false or unspecified, callback will be executed one final time
 *                                    after the last throttled-function call. (After the throttled-function has not been called for `delay` milliseconds,
 *                                    the internal counter is reset)
 * @param  {Function}  callback       A function to be executed after delay milliseconds. The `this` context and all arguments are passed through, as-is,
 *                                    to `callback` when the throttled-function is executed.
 * @param  {Boolean}   debounceMode   If `debounceMode` is true (at begin), schedule `clear` to execute after `delay` ms. If `debounceMode` is false (at end),
 *                                    schedule `callback` to execute after `delay` ms.
 *
 * @return {Function}  A new, throttled, function.
 */
const throttle = function(delay, noTrailing, callback, debounceMode) {
	// After wrapper has stopped being called, this timeout ensures that
	// `callback` is executed at the proper times in `throttle` and `end`
	// debounce modes.
	let timeoutID;

	// Keep track of the last time `callback` was executed.
	let lastExec = 0;

	// `noTrailing` defaults to falsy.
	if ( typeof noTrailing !== 'boolean' ) {
		debounceMode = callback;
		callback = noTrailing;
		noTrailing = undefined;
	}

	// The `wrapper` function encapsulates all of the throttling / debouncing
	// functionality and when executed will limit the rate at which `callback`
	// is executed.
	function wrapper () {
		const self = this
			, elapsed = Number(new Date()) - lastExec
			, args = arguments;

		// Execute `callback` and update the `lastExec` timestamp.
		function exec () {
			lastExec = Number(new Date());
			callback.apply(self, args);
		}

		// If `debounceMode` is true (at begin) this is used to clear the flag
		// to allow future `callback` executions.
		function clear () {
			timeoutID = undefined;
		}

		if ( debounceMode && !timeoutID ) {
			// Since `wrapper` is being called for the first time and
			// `debounceMode` is true (at begin), execute `callback`.
			exec();
		}

		// Clear any existing timeout.
		if ( timeoutID ) {
			clearTimeout(timeoutID);
		}

		if ( debounceMode === undefined && elapsed > delay ) {
			// In throttle mode, if `delay` time has been exceeded, execute
			// `callback`.
			exec();
		} else if ( noTrailing !== true ) {
			// In trailing throttle mode, since `delay` time has not been
			// exceeded, schedule `callback` to execute `delay` ms after most
			// recent execution.
			//
			// If `debounceMode` is true (at begin), schedule `clear` to execute
			// after `delay` ms.
			//
			// If `debounceMode` is false (at end), schedule `callback` to
			// execute after `delay` ms.
			timeoutID = setTimeout(debounceMode ? clear : exec, debounceMode === undefined ? delay - elapsed : delay);
		}
	}
	// Return the wrapper function.
	return wrapper;
};

// Intersection observers are not supported on IE (https://caniuse.com/#feat=intersectionobserver)
const isIntersectionObserverSupported = window.IntersectionObserver !== undefined;

export { extend, isDeepEqual, throttle, isIntersectionObserverSupported };

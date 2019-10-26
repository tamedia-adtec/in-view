import { inViewport } from './viewport';
import { extend, isIntersectionObserverSupported } from './utils';

/**
* - Registry -
*
* Maintain a list of elements, a subset which currently pass
* a given criteria, and fire events when elements move in or out.
*/

// Default options
const defaults = {
    offset: {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    },
    threshold: 0,
    test: inViewport
};

class inViewRegistry {

    constructor(elements, options, selector) {
        // validate options
        this.options  = this.validate(options);
        this.elements = elements;
        this.selector = selector;
        this.current  = [];
        this.handlers = { enter: [], exit: [] };
        this.singles  = { enter: [], exit: [] };
        this.singlesEach = { enter: [], exit: [] };

        if (isIntersectionObserverSupported) {
            this.observer = this._createObserver();
        }
    }

    _createObserver() {
        const observer = new IntersectionObserver(this._onIntersection.bind(this), {
            rootMargin: `${-1 * this.options.offset.top}px ${-1 * this.options.offset.right}px ${-1 * this.options.offset.bottom}px ${-1 * this.options.offset.left}px`,
            threshold: this.options.threshold
        });
        this.elements.forEach(el => observer.observe(el));
        return observer;
    }

    _updateObserver() {
        this.observer.disconnect();
        this.observer = this._createObserver();
    }

    _updateElementState(el, passes) {
        let index   = this.current.indexOf(el);
        let current = index > -1;
        let entered = passes && !current;
        let exited  = !passes && current;

        if (entered) {
            this.current.push(el);
            this.emit('enter', el);
        }

        if (exited) {
            this.current.splice(index, 1);
            this.emit('exit', el);
        }
    }

    _onIntersection(entries) {
        entries.forEach(entry => {
            const passes = entry.isIntersecting && entry.intersectionRatio >= this.options.threshold;
            this._updateElementState(entry.target, passes);
        });
    }

    /**
    * Check each element in the registry, if an element
    * changes states, fire an event and operate on current.
    */
    check() {
        this.elements.forEach(el => {
            const passes = this.options.test(el, this.options);
            this._updateElementState(el, passes);
        });
        return this;
    }

    /**
    * Register a handler for event, to be fired
    * for every event.
    */
    on(event, handler) {
        this.handlers[event].push(handler);
        return this;
    }

    /**
    * Unregister a handler for an event
    * If no handler is provided, Unregister all handlers
    */
    off(event, handler) {
        if (typeof handler === 'undefined') {
            this.handlers[event] = [];
            this.singles[event] = [];
            this.singlesEach[event] = [];
        }
        else {
            ['handlers', 'singles', 'singlesEach'].forEach(key => {
                let handlerIndex = this[key][event].indexOf(handler);
                if (handlerIndex !== -1) {
                    this[key][event].splice(handlerIndex, 1);
                }
            });
        }
        return this;
    }

    /**
    * Register a handler for event, to be fired
    * once and removed.
    */
    once(event, handler) {
        this.singles[event].unshift(handler);
        return this;
    }

    /**
    * Register a handler for event, to be fired
    * once for each element and removed.
    */
    onceEach(event, handler) {
        handler.triggeredOn = []; // This array stores elements on which the handler has already been executed
        this.singlesEach[event].push(handler);
        return this;
    }

    /**
    * Emit event on given element. Used mostly
    * internally, but could be useful for users.
    */
    emit(event, element) {
        // Handlers executed only once
        while(this.singles[event].length) {
            this.singles[event].pop()(element, this.selector);
        }

        // Handlers executed only once but on each element
        let length = this.singlesEach[event].length;
        while (--length > -1) {
            if (this.singlesEach[event][length].triggeredOn.indexOf(element) === -1) {
                this.singlesEach[event][length](element, this.selector);
                this.singlesEach[event][length].triggeredOn.push(element);
            }
            // Remove the handler when it has been executed on each element
            if (this.singlesEach[event][length].triggeredOn.length === this.elements.length) {
                this.singlesEach[event].splice(length, 1);
            }
        }

        length = this.handlers[event].length;
        while (--length > -1) {
            this.handlers[event][length](element, this.selector);
        }
        return this;
    }

    /**
    * Validates the options passed, falls back to defaults
    */
    validate(o) {
        // create local copy of defaults
        let options = extend(true, defaults);
        // if parameter is not an object, return
        if (typeof o !== 'object') return options;
        // validate options
        Object.keys(options).forEach(prop => {
            if (o.hasOwnProperty(prop)) {
                options[prop] = this[prop].bind({
                    options: options
                })(o[prop]);
            }
        });
        return options;
    }

    /**
    * Mutate the offset object with either an object
    * or a number.
    */
    offset(o) {
        let _offset = this.options.offset;
        if (o === undefined) return _offset;
        const isNum = n => typeof n === 'number';
        ['top', 'right', 'bottom', 'left']
            .forEach(isNum(o) ?
                dim => _offset[dim] = o :
                dim => isNum(o[dim]) ? _offset[dim] = o[dim] : null
            );
        return _offset;
    }

    /**
    * Set the threshold with a number.
    */
    threshold(n) {
        let _threshold = this.options.threshold;
        typeof n === 'number' && n >= 0 && n <= 1
            ? _threshold = n
            : _threshold;
        return _threshold;
    }

    /**
    * Use a custom test, overriding inViewport, to
    * determine element visibility.
    */
    test(fn) {
        let _test = this.options.test;
        typeof fn === 'function'
            ? _test = fn
            : _test;
        return _test;
    }
}

let Registry = (elements, options, selector) => new inViewRegistry(elements, options, selector);

export { Registry, defaults };

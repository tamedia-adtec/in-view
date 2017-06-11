import { getElements } from './elements';
import { inViewport, getContext } from './viewport';
import { defaults } from './options';

export default class Register {
  constructor(elements, options) {
    this.elements = getElements(elements);
    this.mapCache = this.elements.map(el => false);
    this.handlers = { enter: [], exit: [] };
    this.setOptions(options);
  }

  update() {
    const map = this.getMap();
    map.forEach((isVisible, index) => {
      const wasVisible = this.mapCache[index];
      this.report(
        this.elements[index],
        (!wasVisible && isVisible),
        (wasVisible && !isVisible)
      );
    });
    this.mapCache = map;
    return this;
  }

  report(element, entered, exited) {
    const type = entered ? 'enter' : exited ? 'exit' : null;
    if (type)
      this.handlers[type].forEach(fn => fn(element));
  }

  on(event, fn) {
    this.handlers[event].push(fn);
    return () => {
      const index = this.handlers[event].indexOf(fn);
      if (index > -1) {
        this.handlers[event].splice(index, 1);
      }
    };
  }

  getMap() {
    return this.elements.map(el => {
      return this.options.test(
        el.getBoundingClientRect(),
        getContext()
      );
    }, this);
  }

  setOptions(options = {}) {
    const prev = this.options || defaults;
    const next = {};
    for (let key in prev) {
      next[key] = options[key] !== undefined
        ? options[key]
        : prev[key];
    }
    this.options = next;
  }
}

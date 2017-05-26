import { getElements } from './elements';
import { inViewport, getContext } from './viewport';
import { defaults } from './options';

export default class Registry {
  constructor(elements, options) {
    this.elements = getElements(elements);
    this.mapCache = this.elements.map(el => false);
    this.options = {
      ...defaults,
      ...options
    };
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
    // Call appropriate handlers...
  }

  getMap() {
    return this.elements.map(el => {
      return this.options.test(
        el.getBoundingClientRect(),
        getContext()
      );
    }, this);
  }
}

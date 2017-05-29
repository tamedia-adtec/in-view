const collectionTypes = [
  HTMLCollection,
  NodeList
];

function toArray(collection) {
  return Array.prototype.slice.call(collection);
}

/**
 * Converts various types of collections of nodes to an
 * array of nodes for use within registries.
 *
 * Accepts an array, HTMLCollection, NodeList, Node, or
 * a jQuery object.
 */
const toElementArray = (obj) => {
  if (Array.isArray(obj))
    return obj;
  if (collectionTypes.some(type => obj instanceof type))
    return toArray(obj);
  if (obj.nodeType)
    return [obj];
  if (typeof obj.get === 'function')
    return obj.get();

  throw new TypeError(
    'Expected an Array, HTMLCollection, NodeList, Node, or jQuery object.'
  );
};

/**
 * Wraps toElementArray, allowing string selectors and
 * providing a default empty array.
 */
export const getElements = (el = []) =>
  toElementArray(
    typeof el === 'string'
      ? document.querySelectorAll(el)
      : el
  );

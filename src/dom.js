const collectionTypes = [
  HTMLCollection,
  NodeList
];

const toElementArray = (obj) => {
  if (Array.isArray(obj))
    return obj;
  if (collectionTypes.some(type => obj instanceof type))
    return [...obj];
  if (obj.nodeType)
    return [obj];
  return obj.get();
};

const getElements = (el) => {
  if (!el)
    return [];
  return toElementArray(
    typeof el === 'string'
      ? document.querySelectorAll(el)
      : el
  );
};

export default getElements;

export const getContext = () =>
  ({ height: window.innerHeight, width: window.innerWidth })

export const inViewport = (rect, context) => {
  return rect.top + rect.height >= 0
      && rect.right - rect.width <= context.width
      && rect.bottom - rect.height <= context.height
      && rect.left + rect.width >= 0;
};

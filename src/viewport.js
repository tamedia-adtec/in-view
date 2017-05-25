export const inViewport = (rect, context) => {
  return rect.top >= 0
      && rect.right <= context.width
      && rect.bottom <= context.height
      && rect.left >= 0;
};

export function createBox({
  width = 100,
  height = 100,
  top = 100,
  left = 100,
  id = 'box'
}) {
  const box = document.createElement('DIV');
  box.style.width = `${width}px`;
  box.style.height = `${height}px`;
  box.style.backgroundColor = 'cyan';
  box.style.position = 'absolute';
  box.style.top = `${top}px`;
  box.style.left = `${left}px`;
  box.id = id;
  box.classList.add('__box');
  document.body.appendChild(box);
  return box;
}

export function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

// Put the bottom of the viewport to the top of the box (+ offset)
export function scrollToBox(box, offset) {
  window.scroll(0, parseInt(box.style.top) - window.innerHeight + offset);
}

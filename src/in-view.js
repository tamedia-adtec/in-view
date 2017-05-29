import Register from './register';
import throttle from 'lodash-es/throttle';

const registry = [];
const triggers = [
  'scroll',
  'resize',
  'load'
];

let checking = false;

function requestFrame(fn) {
  if (!checking) {
    requestAnimationFrame(fn);
    checking = true;
  }
}

const check = throttle(() => {
  registry.forEach(register => register.update())
  checking = false;
}, 100);

triggers.forEach(event =>
  addEventListener(event, () => {
    requestFrame(check);
  })
);

if (MutationObserver) {
  addEventListener('DOMContentLoaded', () => {
    new MutationObserver(check)
      .observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true
      });
  });
}

function inView(elements, options) {
  const register = new Register(elements, options);
  registry.push(register);
  return register;
}

export default inView;

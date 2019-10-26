import inView from '../../src/in-view';
import { createBox, wait, scrollToBox } from '../helpers/e2e-utils';

describe('in-view', function() {
  let inviewInstance = null;

  const onEnterHandler = jasmine.createSpy('on_enter_handler');
  const onExitHandler = jasmine.createSpy('on_exit_handler');
  const onceEnterHandler = jasmine.createSpy('once_enter_handler');
  const onceExitHandler = jasmine.createSpy('once_exit_handler');
  const onceEachEnterHandler = jasmine.createSpy('once-each_enter_handler');
  const onceEachExitHandler = jasmine.createSpy('once-each_exit_handler');

  afterEach(() => {
    // Reset spies
    onEnterHandler.calls.reset();
    onExitHandler.calls.reset();
    onceEnterHandler.calls.reset();
    onceExitHandler.calls.reset();
    onceEachEnterHandler.calls.reset();
    onceEachExitHandler.calls.reset();

    // Clean inviewInstance
    inviewInstance.observer && inviewInstance.observer.disconnect();
    inviewInstance.off('enter').off('exit');
    inviewInstance = null;

    // Remove all boxes
    const boxes = document.querySelectorAll('.__box');
    for (const b of boxes) {
      b.parentNode.removeChild(b);
    }
    window.scrollTo(0, 0);
  });

  it('should detect an element already in the viewport', async function(done) {
    const box = createBox({ top: 250, left: 800 }); // box in viewport
    inviewInstance = inView('#box')
      .on('enter', onEnterHandler)
      .once('enter', onceEnterHandler)
      .onceEach('enter', onceEachEnterHandler)
      .on('exit', onExitHandler)
      .once('exit', onceExitHandler)
      .onceEach('exit', onceEachExitHandler);

    await wait(100); // 100ms minimum between 2 checks

    expect(onEnterHandler).toHaveBeenCalledTimes(1);
    expect(onEnterHandler).toHaveBeenCalledWith(box, '#box');
    expect(onceEnterHandler).toHaveBeenCalledTimes(1);
    expect(onceEnterHandler).toHaveBeenCalledWith(box, '#box');
    expect(onceEachEnterHandler).toHaveBeenCalledTimes(1);
    expect(onceEachEnterHandler).toHaveBeenCalledWith(box, '#box');

    expect(onExitHandler).not.toHaveBeenCalled();
    expect(onceExitHandler).not.toHaveBeenCalled();
    expect(onceEachExitHandler).not.toHaveBeenCalled();

    done();
  });

  it('should detect an element after scrolling', async function(done) {
    const box = createBox({ top: 3000, left: 800 }); // box outside viewport
    inviewInstance = inView('#box')
      .on('enter', onEnterHandler)
      .once('enter', onceEnterHandler)
      .onceEach('enter', onceEachEnterHandler)
      .on('exit', onExitHandler)
      .once('exit', onceExitHandler)
      .onceEach('exit', onceEachExitHandler);

    await wait(100);

    expect(onEnterHandler).not.toHaveBeenCalled();
    expect(onceEnterHandler).not.toHaveBeenCalled();
    expect(onceEachEnterHandler).not.toHaveBeenCalled();

    expect(onExitHandler).not.toHaveBeenCalled();
    expect(onceExitHandler).not.toHaveBeenCalled();
    expect(onceEachExitHandler).not.toHaveBeenCalled();

    scrollToBox(box, 10);
    await wait(100);

    expect(onEnterHandler).toHaveBeenCalledTimes(1);
    expect(onceEnterHandler).toHaveBeenCalledTimes(1);
    expect(onceEachEnterHandler).toHaveBeenCalledTimes(1);

    expect(onExitHandler).not.toHaveBeenCalled();
    expect(onceExitHandler).not.toHaveBeenCalled();
    expect(onceEachExitHandler).not.toHaveBeenCalled();

    done();
  });

  it('should detect entries and exits of an element when scrolling', async function(done) {
    const box = createBox({ top: 3000, left: 800 }); // box outside viewport
    inviewInstance = inView('#box')
      .on('enter', onEnterHandler)
      .once('enter', onceEnterHandler)
      .onceEach('enter', onceEachEnterHandler)
      .on('exit', onExitHandler)
      .once('exit', onceExitHandler)
      .onceEach('exit', onceEachExitHandler);

    scrollToBox(box, 10);
    await wait(100);

    window.scroll(0, 0);
    await wait(100);

    scrollToBox(box, 10);
    await wait(100);

    window.scroll(0, 0);
    await wait(100);

    expect(onEnterHandler).toHaveBeenCalledTimes(2);
    expect(onceEnterHandler).toHaveBeenCalledTimes(1);
    expect(onceEachEnterHandler).toHaveBeenCalledTimes(1);

    expect(onExitHandler).toHaveBeenCalledTimes(2);
    expect(onceExitHandler).toHaveBeenCalledTimes(1);
    expect(onceEachExitHandler).toHaveBeenCalledTimes(1);

    done();
  });

  it('should detect entries and exits of multiple elements when scrolling', async function(done) {
    // 2 boxes outside viewport
    const box1 = createBox({ top: 3000, left: 400, height: 1000 });
    const box2 = createBox({ top: 3000, left: 800 });

    inviewInstance = inView('#box')
      .on('enter', onEnterHandler)
      .once('enter', onceEnterHandler)
      .onceEach('enter', onceEachEnterHandler)
      .on('exit', onExitHandler)
      .once('exit', onceExitHandler)
      .onceEach('exit', onceEachExitHandler);

    scrollToBox(box1, 10);
    await wait(100);

    window.scroll(0, 0);
    await wait(100);

    scrollToBox(box1, 10);
    await wait(100);

    window.scroll(0, 0);
    await wait(100);

    expect(onEnterHandler).toHaveBeenCalledTimes(4);
    expect(onceEnterHandler).toHaveBeenCalledTimes(1);
    expect(onceEachEnterHandler).toHaveBeenCalledTimes(2);
    expect(onEnterHandler).toHaveBeenCalledWith(box1, '#box');
    expect(onEnterHandler).toHaveBeenCalledWith(box2, '#box');

    expect(onExitHandler).toHaveBeenCalledTimes(4);
    expect(onceExitHandler).toHaveBeenCalledTimes(1);
    expect(onceEachExitHandler).toHaveBeenCalledTimes(2);
    expect(onExitHandler).toHaveBeenCalledWith(box1, '#box');
    expect(onExitHandler).toHaveBeenCalledWith(box2, '#box');

    done();
  });

  it('should detect an element according to a threshold', async function(done) {
    const boxHeight = 200;
    const box = createBox({
      height: boxHeight,
      top: 3000,
      left: 400,
      id: 'box2'
    }); // box outside viewport
    inviewInstance = inView('#box2', { threshold: 0.5 }).on(
      'enter',
      onEnterHandler
    );

    scrollToBox(box, boxHeight / 4);
    await wait(100);
    // Only a quarter of the box is visible here
    expect(onEnterHandler).not.toHaveBeenCalled();

    scrollToBox(box, boxHeight * 0.75);
    await wait(100);
    // More than 50% of the box is visible
    expect(onEnterHandler).toHaveBeenCalledTimes(1);

    done();
  });

  it('should detect an element according to an offset', async function(done) {
    const offsetBottom = 50;
    const box = createBox({
      height: 100,
      top: 3000,
      left: 400,
      id: 'box3'
    }); // box outside viewport
    inviewInstance = inView('#box3', { offset: { bottom: offsetBottom } }).on(
      'enter',
      onEnterHandler
    );

    scrollToBox(box, offsetBottom / 2);
    await wait(100);
    // Only 25px of the box are visible
    expect(onEnterHandler).not.toHaveBeenCalled();

    scrollToBox(box, offsetBottom * 1.5);
    await wait(100);
    // 75px of the box are visible
    expect(onEnterHandler).toHaveBeenCalledTimes(1);

    done();
  });
});

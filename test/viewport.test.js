import { inViewport } from '../src/viewport';

const stubRect = {
  top: 25,
  right: 100,
  bottom: 75,
  left: 50
};

describe('inViewport', () => {

  test('returns a boolean', () => {
    const val = inViewport(
      stubRect,
      { width: 200, height: 200 }
    );
    expect(typeof val)
      .toBe('boolean');
  });

  test('calculates correct result', () => {
    const pass = inViewport(
      stubRect,
      { width: 200, height: 200 }
    );
    const fail = inViewport(
      stubRect,
      { width: 90, height: 200 }
    );
    expect(pass).toBe(true);
    expect(fail).toBe(false);
  });

});

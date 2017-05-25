import {
  inViewport,
  getContext
} from '../src/viewport';

const stubRect = {
  top: 25,
  right: 100,
  bottom: 75,
  left: 50,
  width: 10,
  height: 10
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
      { width: 200, height: 64 }
    );
    expect(pass).toBe(true);
    expect(fail).toBe(false);
  });

});

describe('getContext', () => {

  test('returns a context object', () => {
    const keys = Object.keys(getContext());
    expect(keys).toContain('width');
    expect(keys).toContain('height');
  });

});

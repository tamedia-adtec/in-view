import Register from '../src/register';
import { defaults } from '../src/options';

describe('Register', () => {

  test('has elements, mapCache, and options', () => {
    const keys = Object.keys(new Register(document.body));
    expect(keys).toContain('elements');
    expect(keys).toContain('mapCache');
    expect(keys).toContain('options');
  });

  test('receives default options', () => {
    const reg = new Register('.selector');
    expect(reg.options).toEqual(defaults);
  });

  test('creates initial mapCache', () => {
    const reg = new Register('.selector');
    expect(reg.mapCache)
      .toBeInstanceOf(Array);
  });

});

describe('Register.update', () => {

  test('writes mapCache', () => {
    const reg = new Register(document.body);
    expect(reg.mapCache).toEqual([false]);
    reg.update();
    expect(reg.mapCache).toEqual([true]);
  });

  test('returns Register', () => {
    const reg = new Register(document.body);
    expect(reg.update())
      .toBe(reg);
  });

});

describe('Register.on', () => {

  test('adds handlers', () => {
    const reg = new Register(document.body);
    expect(reg.handlers.enter)
      .toHaveLength(0);
    expect(reg.handlers.exit)
      .toHaveLength(0);
    reg.on('enter', () => {});
    reg.on('exit', () => {});
    expect(reg.handlers.enter)
      .toHaveLength(1);
    expect(reg.handlers.exit)
      .toHaveLength(1);
  });

  test('returns a function that removes handler', () => {
    const reg = new Register(document.body);
    const handler = () => {};
    const remove = reg.on('enter', handler);
    expect(reg.handlers.enter)
      .toContain(handler);
    remove();
    expect(reg.handlers.enter)
      .not.toContain(handler);
  });

  test('returns a function that removes only handler', () => {
    const reg = new Register(document.body);
    const handlers = reg.handlers.enter;
    const fn = () => {};
    const remove = reg.on('enter', fn);
    reg.on('enter', () => {});
    expect(handlers).toHaveLength(2);
    expect(handlers).toContain(fn);
    remove();
    expect(handlers).toHaveLength(1);
    expect(handlers).not.toContain(fn);
    remove();
    expect(handlers).toHaveLength(1);
  });

});

describe('Register.report', () => {

  test('calls appropriate handlers', () => {
    const el = document.body;
    const reg = new Register(el);
    const enterHandler = jest.fn();
    const exitHandler = jest.fn();

    reg.on('enter', enterHandler);
    reg.on('exit', exitHandler);

    expect(enterHandler)
      .not.toHaveBeenCalled();

    reg.report(el, true, false);
    expect(enterHandler)
      .toHaveBeenCalledWith(el);
    expect(exitHandler)
      .not.toHaveBeenCalled();

    reg.report(el, false, true);
    expect(exitHandler)
      .toHaveBeenCalledWith(el);
  });

});

describe('Register.getMap', () => {

  test('returns a new Array of element length', () => {
    const arr = new Register(document.body).getMap();
    expect(arr).toBeInstanceOf(Array);
    expect(arr).toHaveLength(1);
  });

});

describe('Register.setOptions', () => {

  test('overwrites existing options', () => {
    const reg = new Register(document.body);
    reg.setOptions({ threshold: 50 });
    expect(reg.options.threshold).toBe(50);
    expect(reg.options.test).toBe(defaults.test);
  });

  test('only writes to existing keys', () => {
    const reg = new Register(document.body);
    reg.setOptions({
      threshold: 25,
      foo: 'bar'
    });
    expect(reg.options.threshold).toBe(25);
    expect(reg.options.foo).toBeUndefined();
  });

});

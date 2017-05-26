import Registry from '../src/registry';
import { defaults } from '../src/options';

describe('Registry', () => {

  test('has elements, mapCache, and options', () => {
    const keys = Object.keys(new Registry(document.body));
    expect(keys).toContain('elements');
    expect(keys).toContain('mapCache');
    expect(keys).toContain('options');
  });

  test('receives default options', () => {
    const reg = new Registry('.selector');
    expect(reg.options).toEqual(defaults);
  });

  test('creates initial mapCache', () => {
    const reg = new Registry('.selector');
    expect(reg.mapCache)
      .toBeInstanceOf(Array);
  });

});

describe('Registry.update', () => {

  test('writes mapCache', () => {
    const reg = new Registry(document.body);
    expect(reg.mapCache).toEqual([false]);
    reg.update();
    expect(reg.mapCache).toEqual([true]);
  });

  test('returns Registry', () => {
    const reg = new Registry(document.body);
    expect(reg.update())
      .toBe(reg);
  });

});

describe('Registry.on', () => {

  test('adds handlers', () => {
    const reg = new Registry(document.body);
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

  test('throws on unsupported event', () => {
    const reg = new Registry(document.body);
    expect(() => {
      reg.on('foo', () => {});
    }).toThrow();
  });

  test('returns a function that removes handler', () => {
    const reg = new Registry(document.body);
    const handler = () => {};
    const remove = reg.on('enter', handler);
    expect(reg.handlers.enter)
      .toContain(handler);
    remove();
    expect(reg.handlers.enter)
      .not.toContain(handler);
  });

});

describe('Registry.report', () => {

  test('calls appropriate handlers', () => {
    const el = document.body;
    const reg = new Registry(el);
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

describe('Registry.getMap', () => {

  test('returns a new Array of element length', () => {
    const arr = new Registry(document.body).getMap();
    expect(arr).toBeInstanceOf(Array);
    expect(arr).toHaveLength(1);
  });

});

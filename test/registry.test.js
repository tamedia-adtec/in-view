import Registry from '../src/registry';
import { defaults } from '../src/options';

describe('Registry', () => {

  test('has elements, mapCache, and options', () => {
    const keys = Object.keys(new Registry(document.body));
    expect(keys).toContain('elements');
    expect(keys).toContain('mapCache');
    expect(keys).toContain('options');
  });

  test('has update, report, getMap', () => {
    const {
      update,
      report,
      getMap
    } = Registry.prototype;
    expect(update).toBeInstanceOf(Function);
    expect(report).toBeInstanceOf(Function);
    expect(getMap).toBeInstanceOf(Function);
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

describe('Registry.getMap', () => {

  test('returns a new Array of element length', () => {
    const arr = new Registry(document.body).getMap();
    expect(arr).toBeInstanceOf(Array);
    expect(arr).toHaveLength(1);
  });

});

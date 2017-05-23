import { getElements } from '../src/elements';
import jQuery from 'jquery';

describe('getElements', () => {

  test('returns empty array by default', () => {
    expect(getElements())
      .toEqual([]);
    expect(getElements(false))
      .toEqual([]);
  });

  test('handles selector strings', () => {
    expect(getElements('body'))
      .toHaveLength(1);
  });

  test('handles element arrays', () => {
    expect(getElements([
      document.body,
      document.head
    ])).toHaveLength(2);
  });

  test('handles HTMLCollection', () => {
    expect(getElements(document.forms))
      .toBeInstanceOf(Array);
  });

  test('handles NodeList', () => {
    const selection = getElements(document.querySelectorAll('body'));
    expect(selection)
      .toBeInstanceOf(Array);
    expect(selection)
      .toHaveLength(1);
  });

  test('handles a single node', () => {
    const selection = getElements(document.body);
    expect(selection)
      .toBeInstanceOf(Array);
    expect(selection)
      .toHaveLength(1);
  });

  test('handles jQuery objects', () => {
    const selection = getElements(jQuery('body'));
    expect(selection)
      .toBeInstanceOf(Array);
    expect(selection)
      .toHaveLength(1);
  });

});

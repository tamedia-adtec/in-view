import test from 'ava';
import { Registry } from '../src/registry';

test('Registry.onceEach registers one handler to singlesEach', t => {

    let registry = Registry([]);

    registry.onceEach('enter', () => {});
    t.true(registry.singlesEach.enter.length === 1);

    registry.onceEach('exit', () => {});
    t.true(registry.singlesEach.exit.length === 1);

    registry.onceEach('enter', () => {});
    t.true(registry.singlesEach.enter.length === 2);

});

test('Registry.onceEach returns the registry', t => {
    let registry = Registry([]);
    t.deepEqual(registry.onceEach('enter', () => {}), registry);
});

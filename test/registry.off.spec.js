import test from 'ava';
import { Registry } from '../src/registry';

test('Registry.off removes all handlers ', t => {

    let registry = Registry([]);

    registry.on('enter', () => {});
    registry.once('enter', () => {});
    registry.onceEach('enter', () => {});
    t.true(registry.handlers.enter.length === 1);
    t.true(registry.singles.enter.length === 1);
    t.true(registry.singlesEach.enter.length === 1);

    registry.on('exit', () => {});
    registry.once('exit', () => {});
    registry.onceEach('exit', () => {});

    registry.on('exit', () => {});
    registry.once('exit', () => {});
    registry.onceEach('exit', () => {});

    t.true(registry.handlers.exit.length === 2);
    t.true(registry.singles.exit.length === 2);
    t.true(registry.singlesEach.exit.length === 2);

    registry.off('enter');
    t.true(registry.handlers.enter.length === 0);
    t.true(registry.singles.enter.length === 0);
    t.true(registry.singlesEach.enter.length === 0);


    registry.off('exit');
    t.true(registry.handlers.exit.length === 0);
    t.true(registry.singles.exit.length === 0);
    t.true(registry.singlesEach.exit.length === 0);
});

test('Registry.off returns the registry', t => {
    let registry = Registry([]);
    t.deepEqual(registry.off('enter'), registry);
});

test('Registry.off removes a specific handler', t => {

    let registry = Registry([]);

    let fnEnterOn = () => {};
    let fnEnterOnce = () => {};
    let fnEnterOnceEach = () => {};

    let fnExitOn = () => {};
    let fnExitOnce = () => {};
    let fnExitOnceEach = () => {};
    let fnExitOn2 = () => {};
    let fnExitOnce2 = () => {};
    let fnExitOnceEach2 = () => {};

    registry.on('enter', fnEnterOn);
    registry.once('enter', fnEnterOnce);
    registry.onceEach('enter', fnEnterOnceEach);
    t.true(registry.handlers.enter.length === 1);
    t.true(registry.singles.enter.length === 1);
    t.true(registry.singlesEach.enter.length === 1);

    registry.on('exit', fnExitOn);
    registry.once('exit', fnExitOnce);
    registry.onceEach('exit', fnExitOnceEach);

    registry.on('exit', fnExitOn2);
    registry.once('exit', fnExitOnce2);
    registry.onceEach('exit', fnExitOnceEach2);

    t.true(registry.handlers.exit.length === 2);
    t.true(registry.singles.exit.length === 2);
    t.true(registry.singlesEach.exit.length === 2);

    registry.off('enter', fnEnterOn);
    t.true(registry.handlers.enter.length === 0);
    t.true(registry.singles.enter.length === 1);
    t.true(registry.singlesEach.enter.length === 1);

    registry.off('exit', fnExitOn);
    t.true(registry.handlers.exit.length === 1);
    t.true(registry.singles.exit.length === 2);
    t.true(registry.singlesEach.exit.length === 2);
});

test('Registry.off removes a specific handler (shared by 2 events)', t => {

    let registry = Registry([]);

    let fnShare1 = () => {};

    registry.on('enter', fnShare1);
    registry.once('enter', fnShare1);

    t.true(registry.handlers.enter.length === 1);
    t.true(registry.singles.enter.length === 1);
    t.true(registry.singlesEach.enter.length === 0);

    registry.off('enter', fnShare1);

    t.true(registry.handlers.enter.length === 0);
    t.true(registry.singles.enter.length === 0);
    t.true(registry.singlesEach.enter.length === 0);
});
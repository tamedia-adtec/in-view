import test from 'ava';
import { Registry } from '../src/registry';

test('Registry.emit calls each handler', t => {

    let registry = Registry([]);

    registry.on('enter', x => t.true(x === 'a'));
    registry.on('enter', y => t.true(y === 'a'));

    registry.on('exit', x => t.true(x === 'b'));
    registry.on('exit', y => t.true(y === 'b'));

    registry.once('enter', x => t.true(x === 'a'));
    registry.once('enter', y => t.true(y === 'a'));

    registry.once('exit', x => t.true(x === 'b'));
    registry.once('exit', y => t.true(y === 'b'));

    registry.onceEach('enter', x => t.true(x === 'a'));
    registry.onceEach('enter', y => t.true(y === 'a'));

    registry.onceEach('exit', x => t.true(x === 'b'));
    registry.onceEach('exit', y => t.true(y === 'b'));

    registry.emit('enter', 'a');
    registry.emit('exit', 'b');

});

test('Registry.emit passes the selector', t => {

    let registry = Registry([], {}, '.foo');

    registry.on('enter', (x, selector) => {
        t.true(selector === '.foo');
    });

    registry.emit('enter', 'a');

});

test('Registry.emit removes once handlers', t => {

    let registry = Registry([]);

    registry.once('enter', () => {});
    t.true(registry.singles.enter.length === 1);

    registry.emit('enter', {});
    t.true(!registry.singles.enter.length);

});

test('Registry.emit removes onceEach handlers when called on each elements', t => {

    let divs = [document.createElement('div'), document.createElement('div')];
    divs.forEach(d => { document.body.appendChild(d); });

    let registry = Registry(divs);

    registry.onceEach('enter', () => {});
    t.true(registry.singlesEach.enter.length === 1);

    registry.emit('enter', divs[0]);
    t.true(registry.singlesEach.enter.length === 1);

    registry.emit('enter', divs[0]);
    t.true(registry.singlesEach.enter.length === 1);

    registry.emit('enter', divs[1]);
    t.true(!registry.singlesEach.enter.length);
});

test('Registry.emit returns the registry', t => {
    let registry = Registry([]);
    t.deepEqual(registry.emit('enter', {}), registry);
});

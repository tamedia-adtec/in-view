import test from 'ava';
import { extend } from '../src/utils';
import { Registry, defaults } from '../src/registry';

const registry = Registry([]);

test('registry.validate returns defaults for non objects', t => {
    t.deepEqual(registry.validate(), defaults);
});

test('registry.validate merges properties', t => {
    let output = extend(true,  defaults, {
        threshold: 0.6
    });
    t.deepEqual(registry.validate({
        threshold: 0.6
    }), output);
});

import test from 'ava';

import method from '../src';

test('works', (t) => {
  t.is(method(2), 4);
});

import test from '../../oletus.mjs'

test ('never settles', () => new Promise (() => {}));

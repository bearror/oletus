import test from '../../oletus.mjs'

test ('never settles', () => new Promise (() => {}));

setTimeout(() => {
  throw new Error ('I like turtles.');
}, 10);

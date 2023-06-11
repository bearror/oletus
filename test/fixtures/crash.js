import test from '../../oletus.js'

test ('never settles', () => new Promise (() => {}));

setTimeout(() => {
  throw new Error ('I like turtles.');
}, 10);

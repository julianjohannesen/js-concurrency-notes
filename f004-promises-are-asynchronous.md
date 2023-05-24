# Promises are Asynchronous

Just like setTimeouts, promises are asychronous. Consider the following example:

```js
console.log('before');

Promise.resolve('some value')
  .then(() => {
    console.log('then1');
  })
  .then(() => {
    console.log('then2');
  });

console.log('after');

//-> 'before'
//-> 'after'
//-> 'then1'
//-> 'then2'
```

What we're seeing here is that the concurrent code runs before the code contained in the then statements. The code in the then statements is picked out of the call stack and placed in the callback queue, and it only runs after all of the concurrent code has finished running. 

This fact isn't obvious when you consider a promise on its own.

```js
const array = [];
Promise.resolve('it worked').then(message => {
  array.push(message);
});
array; //-> ['it worked']
```

What we're NOT seeing in the example above is that the callback in the then statement runs the same way a setTimeout with a 0 timer would run.

```js
setTimeout(message => {
    array.push
}, 0);
```


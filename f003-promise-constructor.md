# Promise constructor

## Losing Composability: Calling a Promise inside of a setTimeout()

```js
function logIt(){console.log('then is running')}
function callback() {Promise.resolve().then(logIt)}
function runInOneSecond() {
  setTimeout(callback, 1000);
}

console.log('before');
runInOneSecond();
console.log('after');

// async console output
//  22 ms  before
//  22 ms  after
//1024 ms  then is running
```

This approach successfully delayed the promise execution, but we still have a problem.

When runInOneSecond starts to run, it sets a timer, but doesn't create the promise. Then, at the 1000 ms mark, the timer fires. **The promise is created and immediately resolved. The promise resolves inside the setTimeout, so our runInOneSecond function can't return it. If runInOneSecond doesn't return a promise, then runInOneSecond().then(...) won't work. We've lost composability**, one of the biggest benefits of promises.

We can fix this by using the **Promise constructor: new Promise()**

```js
function ourCallback(resolve) { resolve(5) }
new Promise(ourCallback); //ASYNC RESULT: {fulfilled: 5}
// The above lines are usually written with the function inlined like this:
new Promise(resolve=>resolve(5)); //-> {fulfilled: 5}
```

Here's an example where we pass resolve() into a callback. The callback calls resolve() within a setTimout(), after 1 second. Then we pass a callback to then() that logs to the console, and then a second callback to another then() that logs something else to the console.

```js
console.log('before');

new Promise(resolve => {
    // wait 1 sec before calling resolve
    setTimeout(resolve, 1000)})
    .then(() => console.log('first then is running'))
    .then(() => console.log('second then is running')); 

console.log('after');

//  7 ms  before
//  8 ms  after
//  1014 ms  first then is running
//  1015 ms  second then is running
```

We can also use the new Promise constructor to create a rejected promise. To do that, we accept a second argument in our callback, reject. So the callback inside of new Promise(myCallback) has both a resolve() method and a reject() method passed into it. In the example, below, the callback is inlined.

```js
new Promise((resolve, reject) => reject(new Error('it failed')));
//-> ASYNC RESULT: {rejected: 'Error: it failed'}
```

Another example:

```js
const users = [
  {id: 1, name: 'Amir'},
  {id: 2, name: 'Betty'},
];

function getUser(id) {
  return new Promise((resolve, reject) => {
    const user = users.find(user => user.id === id);
    if (user) {
      resolve(user);
    } else {
      reject(new Error('no such user'));
    }
  });
}
```

## Promise.resolve() and new Promise(resolve=>myFunc(resolve)) aren't the same thing

One important thing to keep in mind: the resolve function that we get from the constructor is separate from the Promise.resolve method. And the reject function here is separate from the Promise.reject method.

You can think of Promise.resolve and Promise.reject as the simpler versions: when we call Promise.resolve(5), we're creating a new promise that's **immediately fulfilled** with the value 5. We don't need to pass in a callback function, but the trade-off is that **there's also no way for us to delay resolution**.

The promise constructor is the more complex version: **when we do new Promise(resolve => ...), we can delay our call to resolve**. We can even save the resolve function and call it from another part of the system, which we'll see in a future lesson.
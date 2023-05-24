# Promises

## What Are Promises?

MDN describes a promise as **the eventual completion or failure of an asynchronous operation and its resulting value**. Promises allow us to deal with asynchronous values the same we deal with synchronous ones, but instead of using a value itself, we use a promise that the value will eventually by resolved. So, for example, Promises allow us to associate handlers with an asynchronous operation and its eventual value.

If we didn't have Promises, we'd have to use a series of nested callback functions to manage asynchronous operations, leading to something known as **callback hell**. ([Execute Program](https://www.executeprogram.com/) illustrates callback hell with a series of nested setTimeout() calls, each callback calling another callback. These sequential setTimeouts() become difficult to read and debug as we add more steps.)

## Why do we need promises?

### **1. Promises allow us to chain asynchronous operations in a clean, composable way.**

### 2. Promises make it possible to **avoid deep nesting of callback functions**, aka callback hell

## Building a Synchronous Promise API

Execute Program [bootstraps us to Promises](https://www.executeprogram.com/courses/javascript-concurrency/lessons/promise-then) by walking us through an exercise in which we can imagine a function that automatically waits for the previous timer to finish, before calling a subsequent timer.

```js
// This is pseudo code
setTimeout(() => { console.log('0.5 seconds have passed'); }, 500);
then(() => { console.log('1.0 second has passed'); }, 500);
then(() => { console.log('1.5 seconds have passed'); }, 500);
```

Let's start with some values and some transformations of those values.

```js
let value = 5;
value = value * 3;
value = value + 1;
value; //->16
```

Next, we need to put each transformation in its own function, then chain them together.

Rewrite the assignments as the returned values of small functions.

```js
let value = 5;
// value = value * 3 becomes...
value = (n => n * 3)(value)
// value = value + 1 becomes...
value = (n => n + 1)(value);
value; //-> 16
```

Write a chain function to contain the repeated pattern here: **value = someFunction(value)**.

```js
function chain(value) {
    return {
        value: value,
    };
}
chain(5); //-> {value: 5}
```

Tip: Don't be confused by the property name 'value.' That's not our argument. If we'd wanted to use our argument as a key in this key value pair, we'd do it this way:

```js
return {
    [value]: value,
    };
```

chain() returns an object, so we can access that object's properties immediately using dot notation.

```js
chain(5).value; //-> 5
```

Next, we add a then() method, which takes our callback function (the thing we want to do to our value) as an argument. We'll pass the callback in like this:

```js
chain(5).then(n => n * 3).
```

Our then() method should return the new value: in this case, n * 3. Think about then() like this: "whatever came before me happened, and now this function is going to happen".

```js
function chain(value) {
    return {
        value: value,
        then: callback => {
            return callback(value);
        }
    };
}
```

Note that just like value, then() is a property on the object that chain() returns. Just as we accessed chain(5).value above, we can also do chain(5).then(callback) to call the callback function.

```js
chain(5)
.then(n => n * 3); //->15
```

Our problem now is that we can only add a single then call to chain. We aren't yet able to call chain(5).then(...).then(...). To overcome this obstacle, we need to change then's return value. **Instead of returning a value like 5 directly, we wrap the return value in a new chain**. Now the chain function lives up to its name: when we call then(), we get a new chain, and we can call then() on that, which gives us a new chain, etc., recursively. When we're done, we access .value

```js
function chain(value) {
    return {
        value: value,
        then: callback => {
            return chain(callback(value));
        }
    };
}
```

Now we can chain as many then calls to our initial chain() as we want.

```js
chain(5).then(n=>n*2).then(n=>n+4).value //-> 14
```

That's it. We now have a simplified, synchronous representation of the Promise API.

This shows us the basic interface of promises: there's a way to create an object containing a value, and there's a way to add then callbacks that return new values, and there's a way to chain those then calls together indefinitely.

## Real Promises

Now we can switch to real promises, where the equivalent of chain(someValue) is **Promise.resolve(someValue)**

For now, **you can think of Promise.resolve as "create a promise that contains the given value"**

```js
Promise.resolve(11)
    .then(n => n + 1)
    .then(n => n / 2)
    .then(n => console.log(n)); //->6
```

The initial Promise.resolve call returns a promise, and each of the then calls also returns a promise. Just like our chain function, each promise has a then() method. However, there's no value property for us to call. Instead, we can access the value directly inside the then function.

```js
Promise.resolve(5); //-> Promise {<fulfilled>: 5}
// Note that the way Execute Program notates pending and settled promises is not exactly the way your browser's inspection tools might notate pending and settled promises. I'm generally using Chrome's notation.
```

The "fulfilled" part means that the promise actually contains a value.

<hr>

### Pending, Settled, Fulfilled, and Rejected Promises

There are promises that are waiting for something else to happen ("pending") and promises where something has gone wrong ("rejected"). If a promise is not pending, then it's "settled." So, settled promises can either be fulfilled or rejected. For now, all that matters is that every "fulfilled" promise contains a value.

<hr>

Here's another example using Promise.resolve().

Note that we're storing the result of Promise.resolve() in a variable (promise1), so that we can inspect it later. We're also storing the result of our then statements (promise2).

**Tip: Note also that the array is altered whether it's returned from the promise or not. But the array won't be contained in the PromiseResult in, say, Chrome's inspection tools unless the array is returned from the promise.**

```js
const array = [];
array.push('before');

const promise1 = Promise.resolve('this value is ignored in promise2');
const promise2 = promise1
  .then(() => array.push('then'))
  .then(() => array.push('after'))
  // Here's where the array is returned, so we'll see it in PromiseResult in Chrome's inspection tools
  .then(() => array)

promise1; //-> {<fulfilled>: 'this value is ignored in promise2'}
promise2; //-> {<fulfilled>: ['before', 'then', 'after']}
```

We could have added 'this value is ignored' to the array if we had wanted to like this:

```js
const array = [];
array.push('before');
const previouslyIgnoredValue = 'this value will NOT be ignored'
const promise1 = Promise.resolve(previouslyIgnoredValue);
const promise2 = promise1
    // x represents previouslyIgnoredValue and is passed from the promise to its then statement 
  .then(x => array.push(x))
  .then(() => array.push('after'))
  .then(() => array)

promise2; //-> {<fulfilled>: Array(3)}
// If we hadn't returned the array from promise2, the results would have looked like: {<fulfilled>: 3}. In both cases, the 3 is returned by array.push(), which returns the new length of the object upon which it was called.
```

Here's another example of altering an array to add the value contained in Promise.resolve():

```js
const array = [];
const promise1 = Promise.resolve(50)
    .then(x=>array.push(x));
array; //-> [50]
promise1 //-> {<fulfilled>: 1}
```

This is what promise1 looks like in the console in Chrome:

```json
Promise {<fulfilled>: 1}
    [[Prototype]]: Promise
    [[PromiseState]]: "fulfilled"
    [[PromiseResult]]: 1
```

**Tip: Remember to notice your return statements. Compare the above example to this one:**

```js
const array = [];
const promise1 = Promise.resolve(50)
    .then(n => {
        // No return statement here
        array.push(n)
    })
array; //-> [50]
// If you don't explicitly return something from the then statement, it will return undefined.
promise1 //-> {fulfilled: undefined}
```

The promise is still fulfilled and the array is still altered as we would expect, but the PromiseResult is undefined. That's because there's no return statement defined in our callback n=>{array.push(n)}.

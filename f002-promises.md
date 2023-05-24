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


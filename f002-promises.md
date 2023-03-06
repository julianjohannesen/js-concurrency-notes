# Promises

MDN describes a promise as the eventual completion or failure of an asynchronous operation and its resulting value. Promises allow us to treat asynchronous values the same we treat synchronous ones, but instead of using a value itself, we use a promise that that value will eventually by resolved. So, for example, Promises allow us to associate handlers with an asynchronous operation and its eventual value.

If we didn't have Promises, we'd have to use a series of callback functions to manage asynchronous operations, leading to something known as callback hell.

Execute Program illustrates callback hell with a series of nested setTimeout() calls, each callback calling another callback. These sequential setTimeouts() become difficult to read and debug as we add more steps.

Execute Program bootstraps us to Promises by walking us through an exercise in which we can imagine a function that automatically waits for the previous timer to finish, before calling a subsequent timer.

```js
// this is pseudo code
setTimeout(() => { console.log('0.5 seconds have passed'); }, 500);
then(() => { console.log('1.0 second has passed'); }, 500);
then(() => { console.log('1.5 seconds have passed'); }, 500);
```

**Promises allow us to chain asynchronous operations in a clean, composable way.** They also help us to **avoid deep nesting of callback functions**, aka callback hell.

```js
let value = 5;
value = value * 3;
value = value + 1;
value; //->16
```

We'll transform this code to put each step in its own function, then chain them together.

First, we can rewrite the assignments as small functions

```js
let value = 5;
// using functions for our operations
value = (n => n * 3)(value);
value = (n => n + 1)(value);
value; //-> 16
```

We'll introduce a chain function to contain that pattern for us. There's a repeated pattern here: value = someFunction(value).

```js
function chain(value) {
    return {
        value: value,
    };
}
chain(5); //-> {value: 5}
```

This really confused me at first, because I thought that the property name 'value' was our argument. It's not. That would have looked like this:

```js
return {[value]: value}
```

chain() returns an object, so we can access that object's properties immediately using dot notation.

```js
chain(5).value; //-> 5
```

Next, we add a then() method, which takes our callback function (the thing we want to do to our value) as an argument. We'll pass the callback in like this:

```js
chain(5).then(n => n * 3).
```

Our then() method should return the new value: in this case, n * 3. Think about then() like this: "whatever came before me happened, then this function is going to happen".

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

This is a good synchronous representation of what the Promise API allows us to do.

Note that just like value, then() is a property on the object that chain() returns. Just as we accessed chain(5).value above, we can also do chain(5).then(callback) to call the callback function.

```js
chain(5)
.then(n => n * 3); //->15
```

Now, the **final step: we change then's return value. Instead of returning a value like 5 directly, we wrap the return value in a new chain**. Now the chain function lives up to its name: when we call then(), we get a new chain, and we can call then() on that, which gives us a new chain, etc. When we're done, we access .value

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

That's it. We now have a simplified, synchronous representation of the Promise API.

```js
chain(5)
    .then(n => n * 3)
    .value; //->15
```

```js
chain(5)
    .then(n => n * 3)
    .then(n => n + 1)
    .value; //->16
```

This shows us the basic interface of promises: there's a way to create an object containing a value, and there's a way to add then callbacks that return new values.

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
```

The "fulfilled" part means that the promise actually contains a value.
Later, we'll see promises that are waiting for something else to happen ("pending") and promises where something has gone wrong ("rejected")

Promises can be **fulfilled**, **pending**, or **rejected**.

For now, all that matters is that every "fulfilled" promise contains a value.

```js
Promise.resolve(5); //-> {fulfilled: 5} <- This is how Execute Program formats fulfilled promises.
```

Here's another example:

```js
const array = [];
array.push('before');

const promise1 = Promise.resolve('this value is ignored');
const promise2 = promise1
  .then(() => array.push('then'))
  .then(() => array.push('after'))
  .then(() => array)

promise2; //-> {<fulfilled>: ['before', 'then', 'after']}
```

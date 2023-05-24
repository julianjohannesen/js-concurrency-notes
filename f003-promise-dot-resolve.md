## Real Promises and Promise.resolve()

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

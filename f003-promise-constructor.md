# Promise constructor

## Why we need Promise Constructors

So far, we've looked at Promise.resolve(). However, there's a big problem with Promise.resolve() - when we use it, we lose composability - the ability to chain then statements one after another - in certain situations.

```js
function callback() {Promise.resolve().then(console.log('then is running'))}
function runInOneSecond() {setTimeout(callback, 1000)}

console.log('before');
runInOneSecond();
console.log('after');
```

The console will log "before," followed by "after," followed 1 second later by "then is running." This approach successfully delayed the promise execution, but we still have a problem.

When runInOneSecond starts to run, it sets a timer, but doesn't create the promise. Then, at the 1000 ms mark, the timer fires. **Only when the timer fires is the promise created and immediately resolved. The promise resolves inside the setTimeout, so our runInOneSecond function can't return it. If runInOneSecond doesn't return a promise, then runInOneSecond().then(...) won't work. We've lost composability**, and composability is one of the biggest benefits of promises.

If we attempt to store the promise result in a variable called promise1, all we'll see when we inspect promise1 is that the promise was fulfilled and its value is undefined. It makes no difference whether we explicitly attempt to return promise1 from callback and runInOneSecond.

```js
let promise1;
function callback() {
  promise1 = Promise.resolve().then(console.log('then is running'));
}
function runInOneSecond() {
  setTimeout(callback, 1000)
}

console.log('before');
runInOneSecond();
console.log('after');

promise1; 
//-> Promise {<fulfilled>: undefined}
//  [[Prototype]]: Promise
//  [[PromiseState]]: "fulfilled"
//  [[PromiseResult]]: undefined

promise1.then(x=>console.log("this is x: ", x)); //-> this is x:  undefined
```

## The Promise Constructor

We can overcome this limitation by using the Promise constructor, which has the general form:

```js
new Promise(callback)
```

In the example below, notice the callback function's "resolve" parameter. The Promise constructor expects that its callback will take that parameter. It doesn't matter what we call it. We could call it "x" and it would work the same way. What matters is that its the first parameter in the callback.

Inside the callback's body, we can use resolve() to return a promise that contains a value.

```js
function callback(resolve) { 
  return resolve(5);
}
new Promise(callback); //-> {<fulfilled>: 5}

// The above lines are usually written with the callback function inlined like this:
new Promise(resolve=>resolve(5));
// And we could write that like this, if we were of a mind to
new Promise(x=>x(5))
```

Below is an example in which we add an asynchronous setTimeout() to the constructor's callback's body and then call resolve() within the setTimeout(). We also add then statements to the promise that's returned by the Promise constructor.

```js
console.log('before');

new Promise(resolve => setTimeout(resolve, 1000))
    // Now we can add then statements and they work!
    .then(() => console.log('first then is running'))
    .then(() => console.log('second then is running')); 

console.log('after');
```

The console logs "before," followed by "after," followed 1 second later by "first then is running," and then "second then is running."

## Rejections with the Promise Constructor

We can also use the new Promise constructor to create a rejected promise. To do that, we accept a second argument in our callback, the reject method. So the callback inside of new Promise(myCallback) has both a resolve() method and a reject() method passed into it. In the example, below, the callback is inlined.

```js
new Promise((resolve, reject) => reject(new Error('it failed')));
//-> ASYNC RESULT: {rejected: 'Error: it failed'}
```

NOTE: The (resolve, reject) => ... function that we pass to new Promise is called the **"executor"**. We rarely need to talk about it directly, but if you see "executor" mentioned in discussions of promises, this is why.

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

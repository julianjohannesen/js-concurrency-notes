# Promises Resolving to Promises

## Promises can be resolved with other promises

**Promises can be resolved with other promises**. This is important. If they couldn't we'd have a real problem when dealing with things like network requests, writes and reads to and from disks, setTimeouts, etc. All of those things compose nicely with promises that resolve to promises.

Here's an example of a promise resolving another promise:

```js
const promise1 = Promise.resolve(5);
const promise2 = Promise.resolve(promise1);
promise2 //-> {<fulfilled>: 5}
```

## Promises get flattened!

You might have thought that promise2 would resolve to something like {\<fulfilled\>: \<fulfilled\>:5}, but that's not how JavaScript works. There's no such thing as a nested promise result. **When a promise resolves another promise, the promises are flattened.** In this case, when promise1 fulfills, promise2 also fulfills to the same value.

---
### Note on Promise.resolve()

Why don't we just call Promise.resolve() "Promise.fulfill()"? One reason is that Promise.resolve() can result in either a fulfilled promise or a rejected promise. For example:

```js
const promise1 = Promise.reject(new Error("Error!"));
const promise2 = Promise.resolve(promise1);
promise2 //-> {rejected: 'Error: Error!'}
```

---

## We can resolve promises in at least 3 ways

We can resolve with a promise via (a) Promise.resolve or (b) the new Promise constructor or via (3) a then statement. In each case, resolving a promise with a promise works the same way. For example:

```js
const promise1 = Promise.resolve(5);
const promise2 = new Promise(resolve=>resolve(promise1));
const promise3 = promise2.then(n=>n*2);
promise3 //-> {fulfilled: 10}
```

## A promise can include a long chain of then statements

One consequence of how JS flattens promises is that **a then statement can contain a long chain of other then statements. Regardless of how long the chain is, it will be flattened when the promise resolves**.

In this example, the then statement in promise1 takes a promise from Promise.resolve() and uses its promised result to perform an arithmetic operation. Later on, another then statement is attached to promise1, however this new then statement contains promised results from both promise1 and promise2. The new then statement will wait as long as it needs to get those promised results from promise1 and promise2, and then it will perform its own operation on those results.

```js
const promise1 = Promise.resolve(5).then(n => n + 1);
const promise2 = Promise.resolve(10);
promise1.then(n1 => promise2.then(n2 => n1 + n2));
 
//-> {fulfilled: 16}
```

In this example, a setTimeout is used inside a then statement. This wouldn't work, if promises couldn't resolve promises.

```js
Promise.resolve(

).then(
    ()=>console.log('first then')
).then(
    ()=>{
        console.log('second then');
        return new Promise(resolve=>setTimeout(resolve, 1000));
    }
).then(
    ()=>console.log('third then')
);

//-> 'first then'
//-> 'second then'
//-> Promise {<pending>}
//-> 'third then'
```

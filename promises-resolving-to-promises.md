# Promises Resolving to Promises


## Promises that are resolved with other promises are flattened

Promises can be resolved with other promises. For example:

```js
const promise1 = Promise.resolve(5);
const promise2 = Promise.resolve(promise1);
promise2 //-> {<fulfilled>: 5}
```

You might have thought that promise2 would resolve to something like {<fulfilled>: <fulfilled>:5}, but that's not how JavaScript works. There's no such thing as a nested promise result. **When a promise resolves another promise, the promises are flattened.** In this case, when promise1 fulfills, promise2 also fulfills to the same value.

---
### Note on Promise.resolve()

Why don't we just call Promise.resolve() "Promise.fulfill()"? One reason is that Promise.resolve() can result in either a fulfilled promise or a rejected promise. For example:

```js
const promise1 = Promise.reject(new Error("Error!"));
const promise2 = Promise.resolve(promise1);
promise2 //-> {rejected: 'Error: Error!'}
```

---

We can resolve with a promise via (a) Promise.resolve or the (b) new Promise constructor or a (3) then statement. In each case, resolving a promise with a promise works the same way. For example:

```js
const promise1 = Promise.resolve(5);
const promise2 = new Promise(resolve=>resolve(promise1));
const promise3 = promise2.then(n=>n*2);
promise3 //-> {fulfilled: 10}
```

One consequence of how JS flattens promises is that **a then statement can contain a long chain of other then statements. Regardless of how long the chain is, it will be flattened when the promise resolves**.

```js
const promise1 = Promise.resolve(5).then(n => n + 1);
const promise2 = Promise.resolve(10);
promise1.then(n1 => promise2.then(n2 => n1 + n2));
 
//-> {fulfilled: 16}
```


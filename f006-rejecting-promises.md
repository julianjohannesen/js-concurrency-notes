# Rejecting promises

Remember that a settled promise can also be rejected, rather than fulfilled. To create a rejected promise, we can call Promise.reject(someReason). The "reason" argument tells us why the promise was rejected. Most reasons are Error objects, but other JavaScript values are allowed as well.

Execute Program represents rejected promises as objects. Instead of {fulfilled: someValue}, we get {rejected: someReason}.

```js
Promise.reject(new Error('oh no'));
// Async Result: This result will wait up to 3000ms for a response from the code before returning.
//-> {rejected: 'Error: oh no'}
```

Notice how Execute Program represents the error. That's not what it really "looks like" to the browser or to Node.

We turn the error into a string because **JavaScript has no way to represent literal error objects, just as it has no way to represent literal promises**.
The string "Error: oh no" is what we get by calling toString() on the error.

```js
new Error('user does not exist').toString();
//-> 'Error: user does not exist'
```

This is how you'd get the error string in a browser.

```js
{rejected: 'Error: user does not exist'}
```

An example:

```js
const users = [
    {id: 1, name: 'Amir'}
];

function findUser(id) {
    const user = users.find(u => u.id === id);
    if (user === undefined) {
        return Promise.reject(new Error('user does not exist'));
    } else {
        return user;
    }
}

findUser(2);
```

If we throw an exception inside a then callback, the exception is automatically converted into a promise rejection. The thrown error becomes the rejection reason.

The next example fails in the same way as the example above, but does it by throwing the error from a then.
Promise.resolve()
.then(() => {
throw new Error('user does not exist');
});
 Async Result:
Asyncronous ResultThis result will wait up to 3000ms for a response from the code before returning.

{rejected: 'Error: user does not exist'}
Whether you use Promise.reject(new Error('user does not exist')) or Promise.resolve().then(()=>throw new Error('user does not exist') the result is the same.
Any then callbacks chained on the rejected promise will also reject with the same reason. Those then callbacks are never called.
This mirrors how exceptions work in regular JavaScript code. When a line of code throws an exception, the following lines don't execute.
Promise.resolve()
.then(() => {
throw new Error('oh no');
}).then(() => {
return 5;
});
 Async Result:
Asyncronous ResultThis result will wait up to 3000ms for a response from the code before returning.

{rejected: 'Error: oh no'}
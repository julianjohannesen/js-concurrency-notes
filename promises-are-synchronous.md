JavaScript Concurrency: Promise constructor is synchronous
When we do new Promise(...) and pass a callback to the constructor, is our callback called immediately? Or is it scheduled for execution later, like then callbacks are?
the constructor calls the callback immediately!
Promises' then callbacks are always called asynchronously, no matter how the original promise was constructed.
const array = [];
array.push('before');
new Promise(resolve => {
array.push('constructed');
resolve();
}).then(() => {
array.push('then');
});
array.push('after');
array;
 Async Result:
Asyncronous ResultThis result will wait up to 3000ms for a response from the code before returning.

['before', 'constructed', 'after', 'then']
Let's pause to work through what's happening here. First, we passed a callback function to the constructor. The promise constructor always calls its callback synchronously, so ours was called immediately and 'constructed' was pushed.
Second, we called then with another callback. But thens always schedule their callbacks to run asynchronously. The string 'after' was pushed, then our initial code execution finished, and only then did our then callback run.
The promise constructor and then both take callbacks, but it's important to remember that they call them at different times. Constructor callbacks always run immediately and synchronously, while then callbacks are scheduled to run asynchronously.
const array = [];
array.push('before');
new Promise(resolve => {
setTimeout(resolve, 1000);
array.push('constructed');
}).then(() => {
array.push('then');
});
array.push('after');
array;
 Async Result:
Asyncronous ResultThis result will wait up to 3000ms for a response from the code before returning.

['before', 'constructed', 'after', 'then']
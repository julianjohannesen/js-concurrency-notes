# Timers

A simple example using setTimeout(callback, time):

```js
console.log('first');
setTimeout(() => console.log('second'), 100);
console.log('third');
//-> 'first'
//-> 'third'
// Then, after 100 milliseconds...
//-> 'second'
```

Notice that even if the time is set to 0, using a timer at all means the callback does not execute until all of the other, concurrent code in the script has run:

```js
console.log('first');
// Notice the time is 0
setTimeout(() => console.log('second'), 0);
console.log('third');
//-> 'first'
//-> 'third'
//-> 'second'
```

This is true, regardless of the number of timers involved:

```js
const array = [];
array.push('first');
// timer time is 0, so these run after concurrent code runs
for (const i of [1, 2]) {
  setTimeout(() => array.push('second ' + i), 0);
}
array.push('third');
array;
// async result...
//-> ['first', 'third', 'second 1', 'second 2']
```

Here's another example using setTimeout(callback, time):

```js
const users = [
  {name: 'Amir'},
  {name: 'Betty'},
];

function addUserName(names, user) {
  names.push(user.name);
}

function doAsyncWork() {
  const names = [];
  for (const user of users) {
    setTimeout(() => addUserName(names, user), 1000);
  }
  return names;
}

const array = doAsyncWork();
array;
// The synchronous result is...
//-> []
// Then, after 1000 milliseconds, the asynch result is...
//-> ['Amir', 'Betty']
```

 When we create timers with timeouts greater than 0, each will fire when its timeout is reached:

```js
// 'dog' is first, but fires last
setTimeout(() => console.log('dog'), 2000);
setTimeout(() => console.log('cat'), 1000);
// async result...
//-> 'cat'
//-> 'dog'
 ```


/*
const arr = [];
arr.push('before');
const promise1 = Promise.resolve('this value is ignored');
const promise2 = promise1.then(() => {
    arr.push('then');
    arr.push('after');
});
// When the promise is fulfilled, its value us undefined.
// That's because we didn't return anything from the promise.
promise2; //->  {<fulfilled>: undefined}

// Here's how to do it correctly
const arr2 = [];
arr2.push('before');

const promise1a = Promise.resolve('this value is ignored');
const promise2a = promise1a
    .then(() => {
        arr2.push('then');
        arr2.push('after');
    })
    // We must use a then statement to explicitly return arr2, 
    // we can NOT just reference the variable that all of this
    // is stored in.
    .then(()=>arr2)
promise2a; //-> {fulfilled: ['before', 'then', 'after']}

// In this example, 'number' is passed into the callback in the thenable. 
const arr3 = [];
Promise.resolve(50).then(number => {
arr3.push(number);
});
arr3; //-> []

// Now check this out
const arr4 = [];
myValue = "Does this work?";
const promise1b = Promise.resolve(myValue);
const promise2b = promise1b
    .then(x=>arr4.push(x));
promise2b;
*/

console.log('before');

const resolver = resolve => setTimeout(resolve, 1000);
const log1 = ()=>console.log('first then');
const log2 = ()=>console.log('second then');

new Promise(resolver)
    .then(log1)
    .then(log2);

console.log('after');

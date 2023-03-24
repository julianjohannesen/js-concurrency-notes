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

// WHAT'S THE POINT HERE?
// 
console.log('before');

const resolver = resolve => setTimeout(resolve, 1000);
const log1 = ()=>console.log('first then');
const log2 = ()=>console.log('second then');

new Promise(resolver)
    .then(log1)
    .then(log2);

console.log('after'); 
//-> 'before' 'after'
// 1 second later
//-> 'first then' 'second then' 

// WHAT'S THE POINT HERE?
// 1. The callback that is passed to the 'new Promise' is executed synchronously, which means that it immediately pushes 'constructed' to the array. However, **the then statement can't execute until after the promise resolves**. The promise doesn't resolve until after the setTimeout fires resolve() 1 second later. That's how we get ['before', 'constructed', 'after', 'then']
const array = [];
array.push('before');
new Promise(resolve => {
    setTimeout(resolve, 1000);
    array.push('constructed');
})
    .then(() => {array.push('then')});
array.push('after');
array;
//-> ['before', 'constructed', 'after']
// 1 second later
//-> ['before', 'constructed', 'after', 'then']

// WHAT'S THE POINT OF THIS?
typeof setTimeout(() => { /* do nothing */ }); //->'number'

// WHAT'S THE POINT OF THIS?
// Despite throwing an Error in the then statement, the catch statement causes the Promise to fulfill with the caught statements message. You could pass the error into the caught statement if you wanted to.
Promise.resolve()
    .then(() => {
        // If there weren't a catch statement below this, then the promise would reject
        throw new Error('this will reject!');
    })
    // The catch statement allows the promise to fulfill and returns the PromiseResult 'caught'. We could have passed in the error message, I think.
    .catch(() => 'caught');
//-> {fulfilled: 'caught'}

// WHAT'S THE POINT OF THIS?
// The Promise passes resolve into the callback, but doesn't call resolve. If you did call resolve, the result would be the same in terms of the array. The array comes out ['before', 'constructed', 'after'].
const array = [];
array.push('before');
new Promise(resolve => {
    // We don't call resolve()
    array.push('constructed');
});
array.push('after');
array; //-> ['before', 'constructed', 'after']

// If you stored the promise in a variable and then called the variable, then you'd see a difference. When you don't call resolve, the Promise shows as pending. If you call resolve, then the Promise shows as fulfilled. 

// If I wanted to get the updated array to appear in the PromiseResult, I'd have to return the array itself from the Promise, like this:

const array2 = []
array2.push('before')
const thePromise = new Promise(resolve => {
    array2.push('constructed');
    resolve(array2);
})
array2.push('after');
array2; //-> ['before', 'constructed', 'array']
thePromise; //-> {<fulfilled>:Array(3)}

// WHAT'S THE POINT OF THIS?
// If you throw an error from within a then statement, the Promise will be rejected
Promise.resolve()
.then(() => {
    throw new Error('user does not exist');
}); //-> {<rejected>: Error: user does not exist}

// WHAT'S THE POINT OF THIS?
const promise = Promise.resolve({name: 'Amir'});
Object.assign({}, promise);
//-> {}
// We end up with the empty object from Object.assign(), but the promise is nothing.


const array = [];
array.push('before');
const promise1 = Promise.resolve('this value is ignored');
const promise2 = promise1.then(() => {
array.push('then');
array.push('after');
// so you don't have to use a then statement to explicitly return
// the array, you can just reference the variable that all of this
// is stored in. That's what's done below.
});
// Referencing the variable.
promise2;
{fulfilled: ['before', 'then', 'after']}
const array = [];
array.push('before');

const promise1 = Promise.resolve('this value is ignored');
const promise2 = promise1.then(() => {
array.push('then');
array.push('after');
// You HAVE to use a then statement to explicitly return
// the array, you can NOT just reference the variable that all of this
// is stored in.
}).then(()=>array)
// Referencing the variable.
promise2;
const array = [];
Promise.resolve(50).then(number => {
array.push(number);
});
array;
Result:
[]
// Is the problem here that we don't define number anywhere or is it that we don't explicitly return the array? It's the latter. The Promise.resolve(50) gives us the value 50 to work with. That's what 'number' contains in the then() statement. The reason this is undefined as it is, is because there's no .then(()=>array) statement.
JavaScript Concurrency: Catching promise rejections
function tryAndCatch() {
try {
throw new Error();
} catch (e) {
return 'caught';
}
}
tryAndCatch();
Result:
'caught'
An ordinary try...catch statement.
We can catch promise rejection as well, but not with the usual try { ... } catch { ... } syntax. Instead, promises have a .catch(...) method. When a promise rejects, its catch callback (if any) is called.
With catch, we can recover from a rejection, and return a fulfilled promise rather than a rejected one.
Promise.resolve()
.then(() => {
throw new Error('this will reject!');
})
.catch(() => 'caught');
 Async Result:
Asyncronous ResultThis result will wait up to 3000ms for a response from the code before returning.

{fulfilled: 'caught'}
const users = [];
function firstUserName() {
if (users.length === 0) {
throw new Error('there are no users');
} else {
users[0].name;
}
}
// Return a promise containing the first user's name, or "undefined" if there
// are no users.
Promise.resolve()
.then(() => firstUserName())
.catch(() => undefined);
 Async Result:
Asyncronous ResultThis result will wait up to 3000ms for a response from the code before returning.

{fulfilled: undefined}
catch handles rejected promises, but it usually returns a fulfilled promise
A user is making a purchase and enters an invalid discount code. The code here looks for the discount code in the "database" (we use an array instead of a real database). If the discount code doesn't exist, we return a rejected promise.

Unfortunately, the rejected promise will cause our application to return an HTTP 500 error. We don't want that, so we need to handle the rejection. Handle the rejected promise with catch, returning a promise that fulfills with undefined instead.

const discounts = [
{code: 'first-month-free'},
{code: 'annual-sale'},
];
function findDiscountCode(code) {
const discount = discounts.find(d => d.code === code);
if (discount === undefined) {
return Promise.reject(new Error('discount does not exist'));
} else {
return Promise.resolve(discount);
}
}
{fulfilled: undefined}
// Adding a catch statement after calling this function to get the promise to show as fulfilled but undefined. This avoids a server 500 error.
const discounts = [
{code: 'first-month-free'},
{code: 'annual-sale'},
];

function findDiscountCode(code) {
const discount = discounts.find(d => d.code === code);
if (discount === undefined) {
return Promise.reject(new Error('discount does not exist'));
} else {
return Promise.resolve(discount);
}
}
findDiscountCode('please-give-everything-to-me-for-free').catch(e=>undefined)
The catch method is the most common error-handling mechanism in promises
So far, our then callbacks have always taken one callback function.
But then actually takes two callback functions as arguments: .then(onFulfilled, onRejected). The onRejected callback is called when the parent promise rejects.
Promise.reject(new Error('user does not exist'))
.then(
value => 'it fulfilled',
reason => 'it rejected'
);
 Async Result:
Asyncronous ResultThis result will wait up to 3000ms for a response from the code before returning.

{fulfilled: 'it rejected'}
In most cases, rejection is used to indicate an error: something genuinely went wrong. But we can use it for other purposes too.
For example, imagine that we're building a web-based email product. We want to let users import their email archives from other email providers. We do that by connecting to the other provider's mail servers and downloading all of the user's email. There may be hundreds of thousands of emails, so this can take hours. We want to allow the user to abort the import if needed.

We can implement our email import as two chained promises:

Download all of the email from the user's email server, storing it in a temporary location. (This is the slow part!)
then, after all of the email is downloaded, save it in our own email database. (This is much faster than the download.)
If the user asks us to abort the import during phase 1, we can reject that promise. That prevents phase 2 (save the emails in our database), so it's as if we never started. We rejected a promise, but that rejection was due to a user's request, not due to an error.
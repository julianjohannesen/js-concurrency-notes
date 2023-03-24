JSON.stringify(Promise.resolve(5));
Result:
'{}'
Note that stringifying the promise results in a string containing an empty object: '{}'. If you then parse that string, you get the empty object: {}.
JavaScript Concurrency: What's inside a promise?
The most popular promise library is bluebird, which supports the same promise API that we've seen in this course. By looking at the internals of a Bluebird promise, we can get a sense of what's happening under the hood. Here's what's really inside a bluebird promise:
bluebird.Promise.resolve(5);
Result:
{ _bitField: 33554432,
  _fulfillmentHandler0: undefined,
  _rejectionHandler0: 5,
  _promise0: undefined,
  _receiver0: undefined,
  _trace: H { _parent: undefined, _promisesCreated: 0, _length: 1 } }
In browsers, there's no "real" promise object to type because promises' internals are invisible to JavaScript.
what happens if we accidentally serialize a promise into JSON?
If it's a bluebird promise, we'll get the JSON version of the large object shown above. But if it's the browser's built-in type of promise, we'll get {} because its internals are hidden from us!
JSON.stringify(Promise.resolve(5));
Result:
'{}'
If we "round-trip" the promise back into a JavaScript object with JSON.parse, it will still be {} (with no quotes).

>
JSON.parse(JSON.stringify(Promise.resolve(5)));
Result:
{}
Returning a promise instead of its value can be the source of very confusing bugs.
Imagine that we have a system with two parts: an API server that returns JSON responses and a client that consumes them. If we want our API server to return the value inside a promise, the correct solution is to use then to access the value inside the promise.

Suppose that we accidentally add a bug: we return the promise itself, so the promise gets serialized into JSON. The client will see {}, like in the example above.

const bettyPromise = Promise.resolve({name: 'Betty', city: 'Nassau'});
Object.assign({}, bettyPromise);
Result:
{}
Another example of introducing a bug by returning a promise instead of returning its value.
this problem isn't unique to promises
JSON.parse(JSON.stringify(new Error('it failed')));
Result:
{}
JS Errors have the same problem that promises do in that you can do things to them, like stringifying them or even stringifying them and then parsing them back, that will lead to an empty object being returned.
Object.assign({}, new Error('it failed'));
Result:
{}
I wonder if these bugs might be solved by TypeScript b/c TS might warn you if you attempt to return a promise or error or whatever, instead of returning its result.
## The Heap, Stack, Event Loop, Callback Queue and More

### Notes from Philip Roberts' talk "What is the event loop anyway?", JSConfEU 2014

Philip starts with the heap and the stack. The **heap** is where memory allocation occurs. That's just about all that's said about it in Philip's talk.The **call stack** is a data structure that records where in a program we are. When we call a function, we push it onto the top of the call stack. When that function returns, it is popped off the top of the stack. Top and bottom? But what if our function calls other functions? Those functions will also be added ot the call stack, on top of the function that called them. 

```js
// Pseudo code
function myFunc1 {
    return "Yay!";
}
function myFunc2 {
    myFunc1();
}
function myFunc3 {
    myFunc2();
}

myFunc3()
```

When we call myFunc3, we add it to the top of the call stack. myFunc3 calls myFunc2, so we add that to the call stack as well, on top of myFunc3. myFunc2 calls myFunc1, so we add that to the call stack as well, on top of myFunc2. myFunc1 returns the string "Yay!", and is then popped off the top of the stack. That means that myFunc2 has now completed as well, since all it did was call myFunc1. So, myFunc2 is popped off the top of the stack next. Finally, now that myFunc2 has completed, myFunc3 is completed, and it too can be popped off the top of the stack. 

How does the runtime know that a function has completed? Reaching a return statement signals that a function is complete. But even without a return statement, the runtime can figure out that a function has completed.



JS can only perform one task at a time. It is a 'single threaded' language. 


The V8 runtime manages the heap and stack, but it's not what enables various APIs, not even simple things like setTimeout. Where do these things come from then? My impression is that most of those APIs are implemented by the browser, not by the runtime engine. I don't know if this is a useful distinction really.

What about the event loop and callback queue?
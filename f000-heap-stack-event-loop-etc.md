## The Heap, Stack, Event Loop, Callback Queue and More

### Notes from Philip Roberts' talk "What is the event loop anyway?", JSConfEU 2014

The **heap** is where memory allocation occurs. That's just about all that's said about it in Philip's talk.

The **call stack** refers to the order in which JS performs tasks. JS can only perform one task at a time. It is a 'single threaded' language. The call stack records where in a program we are. When we step into a function, we push something onto the stack. When we return something from a function, we pop something off the stack.
# 📤 Promise.object

A Promise.object implementation that deep traverses objects and resolves any Promises.

## Installation

```shell
npm install --save @codefeathers/promise.object
```

## Usage

```JavaScript
Promise.object(<Object>).then(...)
```

> Note that importing this library does not pollute the Promise namespace. You should assign it to `Promise.object` yourself (or whatever you please). It does not interfere with native Promises, or your own Promises A+ compatible library such as Bluebird. It however uses Promises, so if you need to polyfill this is your chance.

## Example

```JavaScript
Promise.object = require('@codefeathers/promise.object');
const { log } = console;

Promise.object({
	foo: Promise.resolve(5),
	bar: {
		baz: Promise.resolve([ 1, 2, 3 ])
	}
}).then(log);

//-> { foo: 5, bar: { baz: [ 1, 2, 3 ] } }
```

We need to go _deeper_!

```JavaScript
Promise.object = require('@codefeathers/promise.object');
const { log } = console;

Promise.object(
	Promise.resolve({
		foo: Promise.resolve({
			bar: Promise.resolve(5)
		})
	})
).then(log);

//-> { foo: { bar: 5 } } 
```

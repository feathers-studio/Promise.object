# 📤 Promise.object

`Promise.object` is `Promise.all` for objects, and it traverses deeply! It's also fully typed.

## Installation

```shell
npm install --save @codefeathers/promise.object
```

## Usage

```TS
import promiseObject from "@codefeathers/promise.object";

const resolved = await Promise.object({
	foo: Promise.resolve(5),
	bar: {
		baz: Promise.resolve([ 1, 2, 3 ])
	}
});

console.log(resolved);
//-> { foo: 5, bar: { baz: [ 1, 2, 3 ] } }
```

We need to go _deeper_!

```JavaScript
import promiseObject from "@codefeathers/promise.object";

const resolved = await Promise.object(
	Promise.resolve({
		foo: Promise.resolve({
			bar: Promise.resolve(5)
		})
	})
);

console.log(resolved);
//-> { foo: { bar: 5 } }
```

## Deno

```TS
import promiseObject from "https://deno.land/x/promise_object@v0.10.0";
```

## Credits

The original idea and challenge was from [@TRGWII](https://github.com/TRGWII).

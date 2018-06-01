Promise.object = require('./es6');
const assert = require('assert');

const linked = {
	foo: Promise.resolve(1),
	bar: {
		foobar: Promise.resolve(2)
	},
	baz: [1, "two", Promise.resolve(3)],
	ok: "four"
}

linked.linked = linked;

Promise.object(linked).then(x => {
	console.log(x);
	assert(x.foo === 1);
	assert(x.bar.foobar === 2);
	assert(x.baz[0] === 1 && x.baz[1] === "two");
	assert(Array.isArray(x.baz) && x.baz[2] === 3);
	assert(x.linked === x);
});

Promise.object(
	Promise.resolve({
		foo: Promise.resolve({
			bar: Promise.resolve(4)
		})
	})
).then(x => {
	console.log(x)
	assert(x.foo.bar === 4);
});
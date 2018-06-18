'use strict';

Promise.object = require('../es5/index.min.js');

// Simple object
const testObject1 = {
	foo: Promise.resolve(1),
	bar: {
		foobar: Promise.resolve(2),
	},
};

const resolvedObject1 = {
	foo: 1,
	bar: {
		foobar: 2
	},
};

// Nested promises with circular reference
const testObject2 = {
	foo: Promise.resolve(1),
	bar: {
		foobar: Promise.resolve(2)
	},
	baz: [ 1, "two", Promise.resolve(3) ],
};

testObject2.link1 = testObject2;
testObject2.link2 = { link3: testObject2 };

const resolvedObject2 = {
	foo: 1,
	bar: {
		foobar: 2,
	},
	baz: [ 1, "two", 3 ],
};

resolvedObject2.link1 = resolvedObject2;
resolvedObject2.link2 = { link3: resolvedObject2 };

// Deeply nested promises
const testObject3 = Promise.resolve({
	foo: Promise.resolve({
		bar: Promise.resolve(
			Promise.resolve(5)
		),
	}),
});

const resolvedObject3 = {
	foo: {
		bar: 5,
	},
};

/* global describe it expect */
describe("Promise.object", () => {

	it("Should return resolvedObject1", () => {
		return Promise.object(testObject1)
			.then(obj => expect(obj).toEqual(resolvedObject1));
	})

	it("Should return resolvedObject2", () => {
		return Promise.object(testObject2)
			.then(obj => expect(obj).toEqual(resolvedObject2));
	})

	it("Should return resolvedObject3", () => {
		return Promise.object(testObject3)
			.then(obj => expect(obj).toEqual(resolvedObject3));
	})

})
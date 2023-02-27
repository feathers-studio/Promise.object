import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";
import { promiseObject } from "./index.ts";

// Simple object
const simple = {
	test: { foo: Promise.resolve(1), bar: { foobar: Promise.resolve(2) } },
	resolved: { foo: 1, bar: { foobar: 2 } },
};

// Nested promises with circular reference
const nested = {
	test: (() => {
		let o = {
			foo: Promise.resolve(1),
			bar: { foobar: Promise.resolve(2) },
			baz: [1, "two", Promise.resolve(3)],
		};

		return Object.assign(o, { link1: o, link2: { link3: o } });
	})(),
	resolved: (() => {
		const o = {
			foo: 1,
			bar: { foobar: 2 },
			baz: [1, "two", 3],
		};

		return Object.assign(o, { link1: o, link2: { link3: o } });
	})(),
};

// Deeply nested promises
const deeplyNested = {
	test: Promise.resolve({ foo: Promise.resolve({ bar: Promise.resolve(Promise.resolve(5)) }) }),
	resolved: { foo: { bar: 5 } },
};

Deno.test("Should resolve simple object", async () => {
	assertEquals(await promiseObject(simple.test), simple.resolved);
});

Deno.test("Should resolve cyclic objects", async () => {
	assertEquals(await promiseObject(nested.test), nested.resolved);
});

Deno.test("Should resolve deeply cyclic objects", async () => {
	assertEquals(await promiseObject(deeplyNested.test), deeplyNested.resolved);
});

"use strict";

/**
 * Returns true if x is an object, false otherwise.
 * @param {any} x
 * @returns {Boolean}
 */
const isObject = x => x &&
	typeof x === 'object' &&
	x.constructor === Object;

/* A well known Symbol. */
const $SELF = typeof Symbol !== 'undefined' ?
	Symbol('SELF') :
	'[~~//-- SELF --//~~]';

/**
 * Replaces values that match the query parameter
 * with a reference to the parent parameter.
 * @param {Object} object Object to make cyclic.
 * @param {any} query Query to match against.
 * @returns {Object}
 */
const makeCyclic = (object, query) => {
	const start = obj => Object.keys(obj).reduce((acc, key) => {
		const value = obj[key];
		if (value === query) {
			obj[key] = object;
			return [...acc, key]
		};
		if (isObject(value)) return [...acc, ...start(value, query)];
		else return acc;
	}, []);
	return start(object);
};

/**
 * Promise.map polyfill.
 * @param {Array.<any>} arr Array of Promises.
 * @param {Function} functor Function to call resolved values.
 */
const PromiseMap = (arr, functor) =>
	Promise.all(arr.map(x => Promise.resolve(x).then(functor)));

/**
 * Resolve a flat object's promises.
 * @param {Object}
 * @returns {Object}
 */
const ResolveObject = obj =>
	Promise.all(
		Object
		.keys(obj)
		.map(key =>
			Promise
			.resolve(obj[key])
			.then(val => obj[key] = val))
	)
	.then(_ => obj);

/**
 * Recursively resolves deep objects with nested promises.
 * @param {Object} object Object or value to resolve.
 * @returns {Object} Resolved object.
 */
const PromiseObject = object => {
	let shouldReplaceSelf = false;
	const ResolveDeepObject = obj =>
		Promise
		.resolve(obj)
		.then(resolvedObject => {
			if (Array.isArray(resolvedObject)) {
				// Promise and map every item to recursively deep resolve.
				return PromiseMap(resolvedObject, obj => ResolveDeepObject(obj));
			} else if (isObject(resolvedObject)) {
				return ResolveObject(
					Object
					.keys(resolvedObject)
					.reduce((acc, key) => {
						if (resolvedObject[key] === object) {
							shouldReplaceSelf = true;
							return {
								...acc,
								[key]: $SELF, // Replace with resolved object.
							}
						}
						return {
							...acc,
							[key]: ResolveDeepObject(resolvedObject[key]),
						}
					}, {}));

			}
			return resolvedObject;
		});
	return ResolveDeepObject(object)
		.then(obj => {
			// Replace $SELF with reference to obj
			if(shouldReplaceSelf) makeCyclic(obj, $SELF);
			return obj;
		});
};

module.exports = PromiseObject;
"use strict";

const isObject = obj => obj && typeof obj === 'object' && obj.constructor === Object;

const makeCircular = (obj, path) => {
	const start = (o, p, i = 1) => {
		if (i === path.length) return o[p[0]] = obj;
		if (p.length > 0) {
			o[p[0]] = {};
			return start(o[p[0]], p.slice(1), i + 1);
		} else return obj;
	}
	return start(obj, path);
};

const findPath = (obj, query) => {
	return Object.keys(obj).reduce((acc, key) => {
		const value = obj[key];
		if (value === query) return [...acc, key];
		if (isObject(value)) return [...acc, ...findPath(value)];
		else return acc;
	}, []);
};

// Resolves array
const PromiseMap = (arr, functor) =>
	Promise.all(arr.map(x => Promise.resolve(x).then(functor)));

// Resolves objects
const ResolveObject = obj =>
	Promise.all(
		Object.keys(obj).map(key =>
			Promise.resolve(obj[key]).then(val => obj[key] = val))
	)
	.then(_ => obj);

// Resolves recrusive deep objects
const PromiseObject = parent => {
	const ResolveDeepObject = object =>
		Promise
		.resolve(object)
		.then(obj => {
			if (Array.isArray(obj)) {
				return PromiseMap(obj, obj => ResolveDeepObject(obj));
			} else if (isObject(obj)) {
				return ResolveObject(
					Object
					.keys(obj)
					.reduce((acc, key) =>
						(obj[key] === parent) ? {
							...acc,
							[key]: '[[ SELF ]]',
						} : {
							...acc,
							[key]: ResolveDeepObject(obj[key]),
						}, {}));
			}
			return obj;
		});
	return ResolveDeepObject(parent)
		.then(obj => {
			const path = findPath(obj, '[[ SELF ]]');
			return path.length > 0 ? makeCircular(obj, path) : obj;
		})
};

module.exports = PromiseObject;
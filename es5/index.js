"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

(function (f) {
	if ((typeof exports === "undefined" ? "undefined" : _typeof(exports)) === "object" && typeof module !== "undefined") {
		module.exports = f();
	} else if (typeof define === "function" && define.amd) {
		define([], f);
	} else {
		var g;if (typeof window !== "undefined") {
			g = window;
		} else if (typeof global !== "undefined") {
			g = global;
		} else if (typeof self !== "undefined") {
			g = self;
		} else {
			g = this;
		}g.promiseObject = f();
	}
})(function () {
	var define, module, exports;return function () {
		function r(e, n, t) {
			function o(i, f) {
				if (!n[i]) {
					if (!e[i]) {
						var c = "function" == typeof require && require;if (!f && c) return c(i, !0);if (u) return u(i, !0);var a = new Error("Cannot find module '" + i + "'");throw a.code = "MODULE_NOT_FOUND", a;
					}var p = n[i] = { exports: {} };e[i][0].call(p.exports, function (r) {
						var n = e[i][1][r];return o(n || r);
					}, p, p.exports, r, e, n, t);
				}return n[i].exports;
			}for (var u = "function" == typeof require && require, i = 0; i < t.length; i++) {
				o(t[i]);
			}return o;
		}return r;
	}()({ 1: [function (require, module, exports) {
			module.exports = require('../index.js');
		}, { "../index.js": 2 }], 2: [function (require, module, exports) {
			"use strict";

			/**
    * Returns true if x is an object, false otherwise.
    * @param {any} x
    * @returns {Boolean}
    */

			var isObject = function isObject(x) {
				return x && (typeof x === "undefined" ? "undefined" : _typeof(x)) === 'object' && x.constructor === Object;
			};

			/* A well known Symbol. */
			var $SELF = typeof Symbol !== 'undefined' ? Symbol('SELF') : '[~~//-- SELF --//~~]';

			/**
    * Replaces values that match the query parameter
    * with a reference to the parent parameter.
    * @param {Object} object Object to make cyclic.
    * @param {any} query Query to match against.
    * @returns {Object}
    */
			var makeCyclic = function makeCyclic(object, query) {
				var start = function start(obj) {
					return Object.keys(obj).reduce(function (acc, key) {
						var value = obj[key];
						if (value === query) {
							obj[key] = object;
							return [].concat(_toConsumableArray(acc), [key]);
						};
						if (isObject(value)) return [].concat(_toConsumableArray(acc), _toConsumableArray(start(value, query)));else return acc;
					}, []);
				};
				return start(object);
			};

			/**
    * Promise.map polyfill.
    * @param {Array.<any>} arr Array of Promises.
    * @param {Function} functor Function to call resolved values.
    */
			var PromiseMap = function PromiseMap(arr, functor) {
				return Promise.all(arr.map(function (x) {
					return Promise.resolve(x).then(functor);
				}));
			};

			/**
    * Resolve a flat object's promises.
    * @param {Object}
    * @returns {Object}
    */
			var ResolveObject = function ResolveObject(obj) {
				return Promise.all(Object.keys(obj).map(function (key) {
					return Promise.resolve(obj[key]).then(function (val) {
						return obj[key] = val;
					});
				})).then(function (_) {
					return obj;
				});
			};

			/**
    * Recursively resolves deep objects with nested promises.
    * @param {Object} object Object or value to resolve.
    * @returns {Object} Resolved object.
    */
			var PromiseObject = function PromiseObject(object) {
				var shouldReplaceSelf = false;
				var ResolveDeepObject = function ResolveDeepObject(obj) {
					return Promise.resolve(obj).then(function (resolvedObject) {
						if (Array.isArray(resolvedObject)) {
							// Promise and map every item to recursively deep resolve.
							return PromiseMap(resolvedObject, function (obj) {
								return ResolveDeepObject(obj);
							});
						} else if (isObject(resolvedObject)) {
							return ResolveObject(Object.keys(resolvedObject).reduce(function (acc, key) {
								if (resolvedObject[key] === object) {
									shouldReplaceSelf = true;
									return _extends({}, acc, _defineProperty({}, key, $SELF));
								}
								return _extends({}, acc, _defineProperty({}, key, ResolveDeepObject(resolvedObject[key])));
							}, {}));
						}
						return resolvedObject;
					});
				};
				return ResolveDeepObject(object).then(function (obj) {
					// Replace $SELF with reference to obj
					if (shouldReplaceSelf) makeCyclic(obj, $SELF);
					return obj;
				});
			};

			module.exports = PromiseObject;
		}, {}] }, {}, [1])(1);
});

type ResolveObject<T> = T extends object
	? T extends Promise<infer U>
		? ResolveObject<U>
		: { [k in keyof T]: ResolveObject<T[k]> }
	: T;

/** Recursively resolves deep objects with nested promises. */
export async function promiseObject<T>(obj: T): Promise<ResolveObject<T>> {
	const seen = new Map<any, unknown>();

	async function resolver<T>(obj: T): Promise<ResolveObject<T>> {
		// null / undefined
		if (obj == null) return obj as ResolveObject<T>;

		// other primitive
		if (typeof obj !== "object") return obj as ResolveObject<T>;

		if (seen.has(obj)) return seen.get(obj) as ResolveObject<T>;

		// PromiseLike
		if ("then" in obj && typeof obj.then === "function") {
			const resolved = resolver(await obj);
			seen.set(obj, resolved);
			return resolved as ResolveObject<T>;
		}

		// Array
		if (Array.isArray(obj)) {
			const resolved = await Promise.all(obj.map(each => Promise.resolve(each).then(resolver)));
			seen.set(obj, resolved);
			return resolved as ResolveObject<T>;
		}

		// object
		const ret = {} as ResolveObject<T>;
		seen.set(obj, ret);
		// @ts-ignore
		for (const [key, value] of Object.entries(obj)) ret[key] = await resolver(value);
		seen.set(obj, ret);
		return ret;
	}

	return resolver(obj);
}

export default promiseObject;

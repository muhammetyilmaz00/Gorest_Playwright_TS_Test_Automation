class ContextStore {

    private data: Map<string, any> = new Map();

    /**
 * Saves a value in the context store associated with the given key.
 *
 * @param key - The unique identifier for the value to be saved.
 * @param value - The value to be stored in the context store.
 *
 * @returns {void} - This function does not return a value.
 */
    save(key: string, value: any): void {
        this.data.set(key, value);
    }

    /**
 * Retrieves the value associated with the given key from the context store.
 *
 * @param key - The unique identifier for the value to be retrieved.
 *
 * @returns {any} - The value associated with the given key, or `undefined` if the key does not exist in the context store.
 */
    get(key: string): any {
        return this.data.get(key);
    }
}
export { ContextStore }
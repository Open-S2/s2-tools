import { S2MMapStore } from '../mmap';

import type { S2CellId } from '../..';
import type { VectorKey, VectorStore } from '.';

/** MMap based vector store */
export class MMapVector<V extends VectorKey> implements VectorStore<V> {
  #store: S2MMapStore;
  /** @param fileName - the path + file name without the extension */
  constructor(fileName?: string) {
    this.#store = new S2MMapStore<V>(fileName);
  }

  /** @returns the length of the store */
  get length(): number {
    return this.#store.length;
  }

  /**
   * Push a value into the store
   * @param value - the value to store
   */
  push(value: V): void {
    this.#store.set(value.cell, value);
  }

  /**
   * @param index - the position in the store to get the value from
   * @returns the value
   */
  async get(index: number | S2CellId): Promise<V> {
    const value = await this.#store.get(BigInt(index));
    if (value === undefined) throw new Error('Value not found');
    return value[0] as V;
  }

  /**
   * Check if the key exists
   * @param key - the key
   * @returns true if the key exists
   */
  async has(key: number | S2CellId): Promise<boolean> {
    return await this.#store.has(BigInt(key));
  }

  /** Sort the store */
  async sort(): Promise<void> {
    await this.#store.sort();
  }

  /**
   * iterate through the values
   * @yields an iterator
   */
  async *values(): AsyncGenerator<V> {
    for await (const { value } of this.#store.entries()) yield value as V;
  }

  /**
   * iterate through the values
   * @returns an iterator
   */
  [Symbol.asyncIterator](): AsyncGenerator<V> {
    return this.values();
  }

  /** Closes the store */
  close(): void {
    this.#store.close(true);
  }
}

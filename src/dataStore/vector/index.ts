import { compare } from '../../dataStructures/uint64';

import type { Uint64Cell } from '../../dataStructures/uint64';

/** The kind of input required to store a vector for proper indexing */
export interface VectorKey {
  cell: Uint64Cell;
}

/** Represents a vector store or an array */
export interface VectorStore<V> {
  push: (value: V) => void;
  get: (index: number) => Promise<V>;
  length: number;
  values: () => AsyncGenerator<V>;
  sort: (() => void) | (() => Promise<void>);
  [Symbol.asyncIterator]: () => AsyncGenerator<V>;
  close: () => void;
}

/** A constructor for a vector store */
export type VectorStoreConstructor<V extends VectorKey> = new () => VectorStore<V>;

/** A local vector key-value store */
export class Vector<V extends VectorKey> implements VectorStore<V> {
  #store: V[] = [];

  /**
   * Push a value into the store
   * @param value - the value to store
   */
  push(value: V): void {
    this.#store.push(value);
  }

  /**
   * @param index - the position in the store to get the value from
   * @returns the value
   */
  async get(index: number): Promise<V> {
    return await this.#store[index];
  }

  /** @returns the length of the store */
  get length(): number {
    return this.#store.length;
  }

  /**
   * iterate through the values
   * @yields an iterator
   */
  async *values(): AsyncGenerator<V> {
    for (const value of this.#store) yield value;
  }

  /** Sort the store in place */
  sort(): void {
    this.#store.sort((a, b): -1 | 0 | 1 => {
      return compare(a.cell, b.cell);
    });
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
    this.#store = [];
  }
}

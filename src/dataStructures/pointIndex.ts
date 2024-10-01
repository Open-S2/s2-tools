import { Vector } from '../dataStore/vector';
import { fromS2Points } from '../geometry/s1/chordAngle';
import { range } from '../geometry';
import { compare, fromS2Point, toCell } from '../dataStructures/uint64';
import { fromS1ChordAngle, getIntersectingCells } from '../geometry/s2/cap';

import { fromLonLat, fromST } from '../geometry/s2/point';

import type { S1ChordAngle } from '../geometry/s1/chordAngle';
import type { Stringifiable } from '../dataStore';
import type { Face, Point3D } from '../geometry';
import type { Uint64, Uint64Cell } from '../dataStructures/uint64';
import type { VectorStore, VectorStoreConstructor } from '../dataStore/vector';

/** The kind of input required to store a point for proper indexing */
export interface PointShape<T = Stringifiable> {
  cell: Uint64Cell;
  point: Point3D;
  data: T;
}

/** An index of cells with radius queries */
export default class PointIndex<T = Stringifiable> {
  #store: VectorStore<PointShape<T>>;
  #unsorted: boolean = false;

  /** @param store - the store to index. May be an in memory or disk */
  constructor(store: VectorStoreConstructor<PointShape<T>> = Vector) {
    this.#store = new store();
  }

  /**
   * @param point - the point to be indexed
   * @param data - the data associated with the point
   */
  insert(point: Point3D, data: T): void {
    this.#store.push({ cell: fromS2Point(point), point, data });
    this.#unsorted = true;
  }

  /**
   * Add a lon-lat pair to the cluster
   * @param lon - longitude in degrees
   * @param lat - latitude in degrees
   * @param data - the data associated with the point
   */
  insertLonLat(lon: number, lat: number, data: T): void {
    this.insert(fromLonLat(lon, lat), data);
  }

  /**
   * @param face - the face of the cell
   * @param s - the s coordinate
   * @param t - the t coordinate
   * @param data - the data associated with the point
   */
  insertFaceST(face: Face, s: number, t: number, data: T): void {
    this.insert(fromST(face, s, t), data);
  }

  /**
   * iterate through the points
   * @yields a PointShape<T>
   */
  async *[Symbol.asyncIterator](): AsyncGenerator<PointShape<T>> {
    await this.sort();
    // return this.#store.values();
    for (const value of this.#store) yield value;
  }

  /**
   * add points from perhaps another index
   * @param points - array of the points to add
   */
  insertPoints(points: PointShape<T>[]): void {
    for (const point of points) this.#store.push(point);
    this.#unsorted = true;
  }

  /** Sort the index in place if unsorted */
  async sort(): Promise<void> {
    if (!this.#unsorted) return;

    await this.#store.sort();
    this.#unsorted = false;
  }

  /**
   * Find the starting index of a search
   * @param id - input id to seek the starting index of the search
   * @returns the starting index
   */
  async lowerBound(id: Uint64): Promise<number> {
    const cellID = toCell(id);
    await this.sort();
    // lower bound search
    let lo: number = 0;
    let hi: number = this.#store.length;
    let mid: number;

    while (lo < hi) {
      mid = Math.floor(lo + (hi - lo) / 2);
      const { cell: midCell } = await this.#store.get(mid);
      if (compare(midCell, cellID) === -1) {
        lo = mid + 1;
      } else {
        hi = mid;
      }
    }

    return lo;
  }

  /**
   * @param low - the lower bound
   * @param high - the upper bound
   * @returns the points in the range
   */
  async searchRange(low: Uint64, high: Uint64): Promise<PointShape<T>[]> {
    await this.sort();
    const res: PointShape<T>[] = [];
    let lo = await this.lowerBound(low);
    const hiID = toCell(high);

    while (true) {
      const currLo = await this.#store.get(lo);
      if (lo < this.#store.length && compare(currLo.cell, hiID) <= 0) break;
      res.push(currLo);
      lo++;
    }

    return res;
  }

  /**
   * @param target - the point to search
   * @param radius - the search radius
   * @returns the points within the radius
   */
  async searchRadius(target: Point3D, radius: S1ChordAngle): Promise<PointShape<T>[]> {
    await this.sort();
    const res: PointShape<T>[] = [];
    if (radius < 0) return res;
    const cap = fromS1ChordAngle<undefined>(target, radius, undefined);
    for (const cell of getIntersectingCells(cap)) {
      // iterate each covering s2cell min-max range on store. check distance from found
      // store Cells to target and if within radius add to results
      const [min, max] = range(cell);
      for (const point of await this.searchRange(min, max)) {
        if (fromS2Points(target, point.point) < radius) res.push(point);
      }
    }

    return res;
  }
}

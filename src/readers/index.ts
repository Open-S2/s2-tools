import type { MValue, Properties, VectorFeatures, VectorGeometry } from '../geometry';

export * from './csv';
export * from './gbfs';
export * from './geotiff';
export * from './gpx';
export * from './grib2';
export * from './gtfs';
export * from './image';
export * from './json';
export * from './las';
export * from './netcdf';
export * from './osm';
export * from './pmtiles';
export * from 'pbf-ts';
export * from './shapefile';
export * from './wkt';
export * from './xml';
export * from './fetch';
export * from './nadgrid';
export * from './tile';

/** Reader interface. Implemented to read data from either a buffer or a filesystem */
export interface Reader {
  // Properties
  byteLength: number;
  byteOffset: number;
  // Getters
  getBigInt64: (byteOffset: number, littleEndian?: boolean) => bigint;
  getBigUint64: (byteOffset: number, littleEndian?: boolean) => bigint;
  getFloat32: (byteOffset: number, littleEndian?: boolean) => number;
  getFloat64: (byteOffset: number, littleEndian?: boolean) => number;
  getInt16: (byteOffset: number, littleEndian?: boolean) => number;
  getInt32: (byteOffset: number, littleEndian?: boolean) => number;
  getInt8: (byteOffset: number) => number;
  getUint16: (byteOffset: number, littleEndian?: boolean) => number;
  getUint32: (byteOffset: number, littleEndian?: boolean) => number;
  getUint8: (byteOffset: number) => number;
  // Methods
  slice: (begin?: number, end?: number) => DataView;
  setStringEncoding: (encoding: string) => void;
  parseString: (byteOffset?: number, byteLength?: number) => string;
  getRange: (offset: number, length: number) => Promise<Uint8Array>;
}

/** Feature iteration interface. Implemented by readers to iterate over features */
export interface FeatureIterator<
  M = Record<string, unknown>,
  D extends MValue = MValue,
  P extends Properties = Properties,
  G extends VectorGeometry<D> = VectorGeometry<D>,
> {
  [Symbol.asyncIterator]: () => AsyncGenerator<VectorFeatures<M, D, P, G>>;
}

/** All input types that can be placed into a reader */
export type ReaderInputs =
  | Reader
  | BufferReader
  | Buffer
  | ArrayBufferLike
  | Uint8Array
  | Uint8ClampedArray
  | Uint16Array
  | Uint32Array
  | Int8Array
  | Int16Array
  | Int32Array
  | Float32Array
  | Float64Array
  | DataView;

/**
 * Convenience function that ensures the input is a usable reader
 * @param input - the input data
 * @returns - a BufferReader
 */
export function toReader(input: ReaderInputs): Reader {
  if (input instanceof BufferReader) return input;
  else if ('buffer' in input) return new BufferReader(input.buffer);
  else if (input instanceof ArrayBuffer || input instanceof SharedArrayBuffer)
    return new BufferReader(input);
  else return input;
}

/** A buffer reader is an extension of a DataView with some extra methods */
export class BufferReader extends DataView<ArrayBufferLike> implements Reader {
  textDecoder = new TextDecoder('utf-8');

  /**
   * @param buffer - the input buffer
   * @param byteOffset - offset in the buffer
   * @param byteLength - length of the buffer
   */
  constructor(buffer: ArrayBufferLike, byteOffset?: number, byteLength?: number) {
    super(buffer, byteOffset, byteLength);
  }

  /**
   * Get a slice of the buffer
   * @param begin - beginning of the slice
   * @param end - end of the slice. If not provided, the end of the data is used
   * @returns - a DataView of the slice
   */
  slice(begin?: number, end?: number): DataView {
    return new DataView(
      this.buffer.slice(this.byteOffset + (begin ?? 0), this.byteOffset + (end ?? this.byteLength)),
    );
  }

  /**
   * Set the text decoder's encoding
   * @param encoding - update the text decoder's encoding
   */
  setStringEncoding(encoding: string) {
    this.textDecoder = new TextDecoder(encoding);
  }

  /**
   * Reads a string from the buffer
   * @param byteOffset - Start of the string
   * @param byteLength - Length of the string
   * @returns - The string
   */
  parseString(byteOffset: number = 0, byteLength: number = this.byteLength): string {
    const { textDecoder } = this;
    const data = this.slice(byteOffset, byteOffset + byteLength).buffer;
    const out = textDecoder.decode(data as ArrayBuffer, { stream: true }) + textDecoder.decode();
    return out.replace(/\0/g, '').trim();
  }

  /**
   * Reads a range from the buffer
   * @param offset - the offset of the range
   * @param length - the length of the range
   * @returns - the ranged buffer
   */
  async getRange(offset: number, length: number): Promise<Uint8Array> {
    return await new Uint8Array(this.buffer).slice(offset, offset + length);
  }
}

import type {
  LASFormat0,
  LASFormat1,
  // LASFormat10,
  LASFormat2,
  LASFormat3,
  // LASFormat4,
  // LASFormat5,
  LASFormat6,
  LASFormat7,
  LASFormat8,
  // LASFormat9,
  LASHeader,
} from './types';
import type { Reader, Transformer, VectorPoint } from '../..';

/**
 * Reads a point using the Point Data Record Format 0
 * @param reader - data reader, works like a DataView
 * @param header - las header
 * @param transformer - vector point transformer
 * @param offset - where to start reading in the point data
 * @returns - The parsed point with Format 0 metadata
 */
export function getPointFormat0(
  reader: Reader,
  header: LASHeader,
  transformer: Transformer,
  offset: number,
): VectorPoint<LASFormat0> {
  const { xOffset, yOffset, zOffset, xScaleFactor, yScaleFactor, zScaleFactor } = header;
  const bits = reader.getUint32(offset + 14, true);
  const classBits = reader.getUint8(offset + 15);
  const point: VectorPoint<LASFormat0> = {
    x: reader.getUint32(offset, true) * xScaleFactor + xOffset,
    y: reader.getUint32(offset + 4, true) * yScaleFactor + yOffset,
    z: reader.getUint32(offset + 8, true) * zScaleFactor + zOffset,
    m: {
      intensity: reader.getUint16(offset + 12, true),
      returnNumber: bits & 0b00000111, // 3 bits (bits 0 – 2)
      numberOfReturns: (bits & 0b00011000) >> 3, // 3 bits (bits 3 – 5)
      ScanDirectionFlag: (bits & 0b00100000) >> 5, // 1 bit (bit 6)
      edgeOfFlightLine: (bits & 0b01000000) >> 6, // 1 bit (bit 7)
      classification: toLASClassification(classBits),
      isSynthetic: (classBits & (1 << 5)) !== 0,
      isKeyPoint: (classBits & (1 << 6)) !== 0,
      isWithheld: (classBits & (1 << 7)) !== 0,
      scanAngleRank: reader.getUint8(offset + 16),
      userData: reader.getUint8(offset + 17),
      pointSourceID: reader.getUint16(offset + 18, true),
    },
  };
  return transformer.forward(point);
}

/**
 * Reads a point using the Point Data Record Format 1
 * @param reader - data reader, works like a DataView
 * @param header - las header
 * @param transformer - vector point transformer
 * @param offset - where to start reading in the point data
 * @returns - The parsed point with Format 1 metadata
 */
export function getPointFormat1(
  reader: Reader,
  header: LASHeader,
  transformer: Transformer,
  offset: number,
): VectorPoint<LASFormat1> {
  const { xOffset, yOffset, zOffset, xScaleFactor, yScaleFactor, zScaleFactor } = header;
  const bits = reader.getUint32(offset + 14, true);
  const classBits = reader.getUint8(offset + 15);
  const point: VectorPoint<LASFormat1> = {
    x: reader.getUint32(offset, true) * xScaleFactor + xOffset,
    y: reader.getUint32(offset + 4, true) * yScaleFactor + yOffset,
    z: reader.getUint32(offset + 8, true) * zScaleFactor + zOffset,
    m: {
      intensity: reader.getUint16(offset + 12, true),
      returnNumber: bits & 0b00000111, // 3 bits (bits 0 – 2)
      numberOfReturns: (bits & 0b00011000) >> 3, // 3 bits (bits 3 – 5)
      ScanDirectionFlag: (bits & 0b00100000) >> 5, // 1 bit (bit 6)
      edgeOfFlightLine: (bits & 0b01000000) >> 6, // 1 bit (bit 7)
      classification: toLASClassification(classBits),
      isSynthetic: (classBits & (1 << 5)) !== 0,
      isKeyPoint: (classBits & (1 << 6)) !== 0,
      isWithheld: (classBits & (1 << 7)) !== 0,
      scanAngleRank: reader.getUint8(offset + 16),
      userData: reader.getUint8(offset + 17),
      pointSourceID: reader.getUint16(offset + 18, true),
      gpsTime: reader.getFloat64(offset + 20, true),
    },
  };
  return transformer.forward(point);
}

/**
 * Reads a point using the Point Data Record Format 2
 * @param reader - data reader, works like a DataView
 * @param header - las header
 * @param transformer - vector point transformer
 * @param offset - where to start reading in the point data
 * @returns - The parsed point with Format 2 metadata
 */
export function getPointFormat2(
  reader: Reader,
  header: LASHeader,
  transformer: Transformer,
  offset: number,
): VectorPoint<LASFormat2> {
  const { xOffset, yOffset, zOffset, xScaleFactor, yScaleFactor, zScaleFactor } = header;
  const bits = reader.getUint32(offset + 14, true);
  const classBits = reader.getUint8(offset + 15);
  const r = reader.getUint16(offset + 20, true);
  const g = reader.getUint16(offset + 22, true);
  const b = reader.getUint16(offset + 24, true);
  const point: VectorPoint<LASFormat2> = {
    x: reader.getUint32(offset, true) * xScaleFactor + xOffset,
    y: reader.getUint32(offset + 4, true) * yScaleFactor + yOffset,
    z: reader.getUint32(offset + 8, true) * zScaleFactor + zOffset,
    m: {
      intensity: reader.getUint16(offset + 12, true),
      returnNumber: bits & 0b00000111, // 3 bits (bits 0 – 2)
      numberOfReturns: (bits & 0b00011000) >> 3, // 3 bits (bits 3 – 5)
      ScanDirectionFlag: (bits & 0b00100000) >> 5, // 1 bit (bit 6)
      edgeOfFlightLine: (bits & 0b01000000) >> 6, // 1 bit (bit 7)
      classification: toLASClassification(classBits),
      isSynthetic: (classBits & (1 << 5)) !== 0,
      isKeyPoint: (classBits & (1 << 6)) !== 0,
      isWithheld: (classBits & (1 << 7)) !== 0,
      scanAngleRank: reader.getUint8(offset + 16),
      userData: reader.getUint8(offset + 17),
      pointSourceID: reader.getUint16(offset + 18, true),
      rgba: { r, g, b, a: 255 },
    },
  };
  return transformer.forward(point);
}

/**
 * Reads a point using the Point Data Record Format 3
 * @param reader - data reader, works like a DataView
 * @param header - las header
 * @param transformer - vector point transformer
 * @param offset - where to start reading in the point data
 * @returns - The parsed point with Format 3 metadata
 */
export function getPointFormat3(
  reader: Reader,
  header: LASHeader,
  transformer: Transformer,
  offset: number,
): VectorPoint<LASFormat3> {
  const { xOffset, yOffset, zOffset, xScaleFactor, yScaleFactor, zScaleFactor } = header;
  const gpsTime = reader.getFloat64(offset + 20, true);
  const r = reader.getUint16(offset + 28, true);
  const g = reader.getUint16(offset + 30, true);
  const b = reader.getUint16(offset + 32, true);
  const bits = reader.getUint32(offset + 14, true);
  const classBits = reader.getUint8(offset + 15);
  const point: VectorPoint<LASFormat3> = {
    x: reader.getUint32(offset, true) * xScaleFactor + xOffset,
    y: reader.getUint32(offset + 4, true) * yScaleFactor + yOffset,
    z: reader.getUint32(offset + 8, true) * zScaleFactor + zOffset,
    m: {
      intensity: reader.getUint16(offset + 12, true),
      returnNumber: bits & 0b00000111, // 3 bits (bits 0 – 2)
      numberOfReturns: (bits & 0b00011000) >> 3, // 3 bits (bits 3 – 5)
      ScanDirectionFlag: (bits & 0b00100000) >> 5, // 1 bit (bit 6)
      edgeOfFlightLine: (bits & 0b01000000) >> 6, // 1 bit (bit 7)
      classification: toLASClassification(classBits),
      isSynthetic: (classBits & (1 << 5)) !== 0,
      isKeyPoint: (classBits & (1 << 6)) !== 0,
      isWithheld: (classBits & (1 << 7)) !== 0,
      scanAngleRank: reader.getUint8(offset + 16),
      userData: reader.getUint8(offset + 17),
      pointSourceID: reader.getUint16(offset + 18, true),
      gpsTime,
      rgba: { r, g, b, a: 255 },
    },
  };
  return transformer.forward(point);
}

// /**
//  * Reads a point using the Point Data Record Format 4
//  * @param reader - data reader, works like a DataView
//  * @param header - las header
//  * @param transformer - vector point transformer
//  * @param offset - where to start reading in the point data
//  * @returns - The parsed point with Format 4 metadata
//  */
// export function getPointFormat4(
//   reader: Reader,
//   header: LASHeader,
//   transformer: Transformer,
//   offset: number,
// ): VectorPoint<LASFormat4> {
//   const { xOffset, yOffset, zOffset, xScaleFactor, yScaleFactor, zScaleFactor } = header;
//   const bits = reader.getUint32(offset + 14, true);
//   const classBits = reader.getUint8(offset + 15);
//   const point: VectorPoint<LASFormat4> = {
//     x: reader.getUint32(offset, true) * xScaleFactor + xOffset,
//     y: reader.getUint32(offset + 4, true) * yScaleFactor + yOffset,
//     z: reader.getUint32(offset + 8, true) * zScaleFactor + zOffset,
//     m: {
//       intensity: reader.getUint16(offset + 12, true),
//       returnNumber: bits & 0b00000111, // 3 bits (bits 0 – 2)
//       numberOfReturns: (bits & 0b00011000) >> 3, // 3 bits (bits 3 – 5)
//       ScanDirectionFlag: (bits & 0b00100000) >> 5, // 1 bit (bit 6)
//       edgeOfFlightLine: (bits & 0b01000000) >> 6, // 1 bit (bit 7)
//       classification: toLASClassification(classBits),
//       isSynthetic: (classBits & (1 << 5)) !== 0,
//       isKeyPoint: (classBits & (1 << 6)) !== 0,
//       isWithheld: (classBits & (1 << 7)) !== 0,
//       scanAngleRank: reader.getUint8(offset + 16),
//       userData: reader.getUint8(offset + 17),
//       pointSourceID: reader.getUint16(offset + 18, true),
//       gpsTime: reader.getFloat64(offset + 20, true),
//       wavePacketDescriptorIndex: reader.getUint8(offset + 28),
//       wavePacketOffset: reader.getFloat64(offset + 29, true),
//       wavePacketLength: reader.getUint32(offset + 37, true),
//       waveformLocationReturnPoint: reader.getFloat32(offset + 41, true),
//       xT: reader.getFloat32(offset + 45, true),
//       yT: reader.getFloat32(offset + 49, true),
//       zT: reader.getFloat32(offset + 53, true),
//     },
//   };
//   return transformer.forward(point);
// }

// /**
//  * Reads a point using the Point Data Record Format 5
//  * @param reader - data reader, works like a DataView
//  * @param header - las header
//  * @param transformer - vector point transformer
//  * @param offset - where to start reading in the point data
//  * @returns - The parsed point with Format 4 metadata
//  */
// export function getPointFormat5(
//   reader: Reader,
//   header: LASHeader,
//   transformer: Transformer,
//   offset: number,
// ): VectorPoint<LASFormat5> {
//   const { xOffset, yOffset, zOffset, xScaleFactor, yScaleFactor, zScaleFactor } = header;
//   const gpsTime = reader.getFloat64(offset + 20, true);
//   const r = reader.getUint16(offset + 28, true);
//   const g = reader.getUint16(offset + 30, true);
//   const b = reader.getUint16(offset + 32, true);
//   const bits = reader.getUint32(offset + 14, true);
//   const classBits = reader.getUint8(offset + 15);
//   const point: VectorPoint<LASFormat5> = {
//     x: reader.getUint32(offset, true) * xScaleFactor + xOffset,
//     y: reader.getUint32(offset + 4, true) * yScaleFactor + yOffset,
//     z: reader.getUint32(offset + 8, true) * zScaleFactor + zOffset,
//     m: {
//       intensity: reader.getUint16(offset + 12, true),
//       returnNumber: bits & 0b00000111, // 3 bits (bits 0 – 2)
//       numberOfReturns: (bits & 0b00011000) >> 3, // 3 bits (bits 3 – 5)
//       ScanDirectionFlag: (bits & 0b00100000) >> 5, // 1 bit (bit 6)
//       edgeOfFlightLine: (bits & 0b01000000) >> 6, // 1 bit (bit 7)
//       classification: toLASClassification(classBits),
//       isSynthetic: (classBits & (1 << 5)) !== 0,
//       isKeyPoint: (classBits & (1 << 6)) !== 0,
//       isWithheld: (classBits & (1 << 7)) !== 0,
//       scanAngleRank: reader.getUint8(offset + 16),
//       userData: reader.getUint8(offset + 17),
//       pointSourceID: reader.getUint16(offset + 18, true),
//       gpsTime,
//       rgba: { r, g, b, a: 255 },
//       wavePacketDescriptorIndex: reader.getUint8(offset + 28),
//       wavePacketOffset: reader.getFloat64(offset + 29, true),
//       wavePacketLength: reader.getUint32(offset + 37, true),
//       waveformLocationReturnPoint: reader.getFloat32(offset + 41, true),
//       xT: reader.getFloat32(offset + 45, true),
//       yT: reader.getFloat32(offset + 49, true),
//       zT: reader.getFloat32(offset + 53, true),
//     },
//   };
//   return transformer.forward(point);
// }

/**
 * Reads a point using the Point Data Record Format 0
 * @param reader - data reader, works like a DataView
 * @param header - las header
 * @param transformer - vector point transformer
 * @param offset - where to start reading in the point data
 * @returns - The parsed point with Format 0 metadata
 */
export function getPointFormat6(
  reader: Reader,
  header: LASHeader,
  transformer: Transformer,
  offset: number,
): VectorPoint<LASFormat6> {
  const { xOffset, yOffset, zOffset, xScaleFactor, yScaleFactor, zScaleFactor } = header;
  const bits1 = reader.getUint8(offset + 14);
  const bits2 = reader.getUint8(offset + 15);
  const point: VectorPoint<LASFormat6> = {
    x: reader.getUint32(offset, true) * xScaleFactor + xOffset,
    y: reader.getUint32(offset + 4, true) * yScaleFactor + yOffset,
    z: reader.getUint32(offset + 8, true) * zScaleFactor + zOffset,
    m: {
      intensity: reader.getUint16(offset + 12, true),
      returnNumber: bits1 & 0b00001111, // 4 bits (bits 0 – 3)
      numberOfReturns: (bits1 & 0b11110000) >> 4, // 4 bits (bits 4 – 7)
      classificationFlag: toLASClassificationFlag(bits2), // 4 bis (bit 0 - 3)
      scannerChannel: (bits2 & 0b00110000) >> 4, // 2 bits (bit 4 - 5)
      scanDirectionFlag: (bits2 & 0b01000000) >> 6, // 1 bit (bit 6)
      edgeOfFlightLine: (bits2 & 0b10000000) >> 7, // 1 bit (bit 7)
      classification: toLASClassification2(reader.getUint8(offset + 16)),
      userData: reader.getUint8(offset + 17),
      scanAngle: reader.getUint16(offset + 18, true),
      pointSourceID: reader.getUint16(offset + 20, true),
      gpsTime: reader.getFloat64(offset + 22, true),
    },
  };
  return transformer.forward(point);
}

/**
 * Reads a point using the Point Data Record Format 7
 * @param reader - data reader, works like a DataView
 * @param header - las header
 * @param transformer - vector point transformer
 * @param offset - where to start reading in the point data
 * @returns - The parsed point with Format 7 metadata
 */
export function getPointFormat7(
  reader: Reader,
  header: LASHeader,
  transformer: Transformer,
  offset: number,
): VectorPoint<LASFormat7> {
  const { xOffset, yOffset, zOffset, xScaleFactor, yScaleFactor, zScaleFactor } = header;
  const bits1 = reader.getUint8(offset + 14);
  const bits2 = reader.getUint8(offset + 15);
  const point: VectorPoint<LASFormat7> = {
    x: reader.getUint32(offset, true) * xScaleFactor + xOffset,
    y: reader.getUint32(offset + 4, true) * yScaleFactor + yOffset,
    z: reader.getUint32(offset + 8, true) * zScaleFactor + zOffset,
    m: {
      intensity: reader.getUint16(offset + 12, true),
      returnNumber: bits1 & 0b00001111, // 4 bits (bits 0 – 3)
      numberOfReturns: (bits1 & 0b11110000) >> 4, // 4 bits (bits 4 – 7)
      classificationFlag: toLASClassificationFlag(bits2), // 4 bis (bit 0 - 3)
      scannerChannel: (bits2 & 0b00110000) >> 4, // 2 bits (bit 4 - 5)
      scanDirectionFlag: (bits2 & 0b01000000) >> 6, // 1 bit (bit 6)
      edgeOfFlightLine: (bits2 & 0b10000000) >> 7, // 1 bit (bit 7)
      classification: toLASClassification2(reader.getUint8(offset + 16)),
      userData: reader.getUint8(offset + 17),
      scanAngle: reader.getUint16(offset + 18, true),
      pointSourceID: reader.getUint16(offset + 20, true),
      gpsTime: reader.getFloat64(offset + 22, true),
      rgba: {
        r: reader.getUint16(offset + 30, true),
        g: reader.getUint16(offset + 32, true),
        b: reader.getUint16(offset + 34, true),
        a: reader.getUint16(offset + 36, true),
      },
    },
  };
  return transformer.forward(point);
}

/**
 * Reads a point using the Point Data Record Format 8
 * @param reader - data reader, works like a DataView
 * @param header - las header
 * @param transformer - vector point transformer
 * @param offset - where to start reading in the point data
 * @returns - The parsed point with Format 8 metadata
 */
export function getPointFormat8(
  reader: Reader,
  header: LASHeader,
  transformer: Transformer,
  offset: number,
): VectorPoint<LASFormat8> {
  const { xOffset, yOffset, zOffset, xScaleFactor, yScaleFactor, zScaleFactor } = header;
  const bits1 = reader.getUint8(offset + 14);
  const bits2 = reader.getUint8(offset + 15);
  const point: VectorPoint<LASFormat8> = {
    x: reader.getUint32(offset, true) * xScaleFactor + xOffset,
    y: reader.getUint32(offset + 4, true) * yScaleFactor + yOffset,
    z: reader.getUint32(offset + 8, true) * zScaleFactor + zOffset,
    m: {
      intensity: reader.getUint16(offset + 12, true),
      returnNumber: bits1 & 0b00001111, // 4 bits (bits 0 – 3)
      numberOfReturns: (bits1 & 0b11110000) >> 4, // 4 bits (bits 4 – 7)
      classificationFlag: toLASClassificationFlag(bits2), // 4 bis (bit 0 - 3)
      scannerChannel: (bits2 & 0b00110000) >> 4, // 2 bits (bit 4 - 5)
      scanDirectionFlag: (bits2 & 0b01000000) >> 6, // 1 bit (bit 6)
      edgeOfFlightLine: (bits2 & 0b10000000) >> 7, // 1 bit (bit 7)
      classification: toLASClassification2(reader.getUint8(offset + 16)),
      userData: reader.getUint8(offset + 17),
      scanAngle: reader.getUint16(offset + 18, true),
      pointSourceID: reader.getUint16(offset + 20, true),
      gpsTime: reader.getFloat64(offset + 22, true),
      rgba: {
        r: reader.getUint16(offset + 30, true),
        g: reader.getUint16(offset + 32, true),
        b: reader.getUint16(offset + 34, true),
        a: reader.getUint16(offset + 36, true),
      },
      nir: reader.getUint16(offset + 38, true),
    },
  };
  return transformer.forward(point);
}

// /**
//  * Reads a point using the Point Data Record Format 9
//  * @param reader - data reader, works like a DataView
//  * @param header - las header
//  * @param transformer - vector point transformer
//  * @param offset - where to start reading in the point data
//  * @returns - The parsed point with Format 9 metadata
//  */
// export function getPointFormat9(
//   reader: Reader,
//   header: LASHeader,
//   transformer: Transformer,
//   offset: number,
// ): VectorPoint<LASFormat9> {
//   const { xOffset, yOffset, zOffset, xScaleFactor, yScaleFactor, zScaleFactor } = header;
//   const bits1 = reader.getUint8(offset + 14);
//   const bits2 = reader.getUint8(offset + 15);
//   const point: VectorPoint<LASFormat9> = {
//     x: reader.getUint32(offset, true) * xScaleFactor + xOffset,
//     y: reader.getUint32(offset + 4, true) * yScaleFactor + yOffset,
//     z: reader.getUint32(offset + 8, true) * zScaleFactor + zOffset,
//     m: {
//       intensity: reader.getUint16(offset + 12, true),
//       returnNumber: bits1 & 0b00001111, // 4 bits (bits 0 – 3)
//       numberOfReturns: (bits1 & 0b11110000) >> 4, // 4 bits (bits 4 – 7)
//       classificationFlag: toLASClassificationFlag(bits2), // 4 bis (bit 0 - 3)
//       scannerChannel: (bits2 & 0b00110000) >> 4, // 2 bits (bit 4 - 5)
//       scanDirectionFlag: (bits2 & 0b01000000) >> 6, // 1 bit (bit 6)
//       edgeOfFlightLine: (bits2 & 0b10000000) >> 7, // 1 bit (bit 7)
//       classification: toLASClassification2(reader.getUint8(offset + 16)),
//       userData: reader.getUint8(offset + 17),
//       scanAngle: reader.getUint16(offset + 18, true),
//       pointSourceID: reader.getUint16(offset + 20, true),
//       gpsTime: reader.getFloat64(offset + 22, true),
//       wavePacketDescriptorIndex: reader.getUint8(offset + 30),
//       wavePacketOffset: reader.getFloat64(offset + 31, true),
//       wavePacketLength: reader.getUint32(offset + 39, true),
//       waveformLocationReturnPoint: reader.getFloat32(offset + 43, true),
//       xT: reader.getFloat32(offset + 47, true),
//       yT: reader.getFloat32(offset + 51, true),
//       zT: reader.getFloat32(offset + 55, true),
//     },
//   };
//   return transformer.forward(point);
// }

// /**
//  * Reads a point using the Point Data Record Format 10
//  * @param reader - data reader, works like a DataView
//  * @param header - las header
//  * @param transformer - vector point transformer
//  * @param offset - where to start reading in the point data
//  * @returns - The parsed point with Format 10 metadata
//  */
// export function getPointFormat10(
//   reader: Reader,
//   header: LASHeader,
//   transformer: Transformer,
//   offset: number,
// ): VectorPoint<LASFormat10> {
//   const { xOffset, yOffset, zOffset, xScaleFactor, yScaleFactor, zScaleFactor } = header;
//   const bits1 = reader.getUint8(offset + 14);
//   const bits2 = reader.getUint8(offset + 15);
//   const point: VectorPoint<LASFormat10> = {
//     x: reader.getUint32(offset, true) * xScaleFactor + xOffset,
//     y: reader.getUint32(offset + 4, true) * yScaleFactor + yOffset,
//     z: reader.getUint32(offset + 8, true) * zScaleFactor + zOffset,
//     m: {
//       intensity: reader.getUint16(offset + 12, true),
//       returnNumber: bits1 & 0b00001111, // 4 bits (bits 0 – 3)
//       numberOfReturns: (bits1 & 0b11110000) >> 4, // 4 bits (bits 4 – 7)
//       classificationFlag: toLASClassificationFlag(bits2), // 4 bis (bit 0 - 3)
//       scannerChannel: (bits2 & 0b00110000) >> 4, // 2 bits (bit 4 - 5)
//       scanDirectionFlag: (bits2 & 0b01000000) >> 6, // 1 bit (bit 6)
//       edgeOfFlightLine: (bits2 & 0b10000000) >> 7, // 1 bit (bit 7)
//       classification: toLASClassification2(reader.getUint8(offset + 16)),
//       userData: reader.getUint8(offset + 17),
//       scanAngle: reader.getUint16(offset + 18, true),
//       pointSourceID: reader.getUint16(offset + 20, true),
//       gpsTime: reader.getFloat64(offset + 22, true),
//       rgba: {
//         r: reader.getUint16(offset + 30, true),
//         g: reader.getUint16(offset + 32, true),
//         b: reader.getUint16(offset + 34, true),
//         a: reader.getUint16(offset + 36, true),
//       },
//       wavePacketDescriptorIndex: reader.getUint8(offset + 38),
//       wavePacketOffset: reader.getFloat64(offset + 39, true),
//       wavePacketLength: reader.getUint32(offset + 47, true),
//       waveformLocationReturnPoint: reader.getFloat32(offset + 51, true),
//       xT: reader.getFloat32(offset + 55, true),
//       yT: reader.getFloat32(offset + 59, true),
//       zT: reader.getFloat32(offset + 63, true),
//     },
//   };
//   return transformer.forward(point);
// }

/**
 * Converts a number into a LASClassification
 * @param classification - the number
 * @returns - the LASClassification
 */
function toLASClassification(classification: number): string {
  // we only wany the first 5 bits
  classification &= 0b11111;
  if (classification === 0) return 'Created, Never Classified';
  if (classification === 1) return 'Unclassified';
  if (classification === 2) return 'Ground';
  if (classification === 3) return 'Low Vegetation';
  if (classification === 4) return 'Medium Vegetation';
  if (classification === 5) return 'High Vegetation';
  if (classification === 6) return 'Building';
  if (classification === 7) return 'Low Point (Noise)';
  if (classification === 8) return 'Model Key-point (mass point)';
  if (classification === 9) return 'Water';
  if (classification === 12) return 'Overlap Points';
  return 'Reserved';
}

/**
 * Converts a number into a classification flag
 * @param classFlag - the input
 * @returns - the classification flag
 */
function toLASClassificationFlag(classFlag: number): string {
  const firstThreeBits = classFlag & 0b1111;
  if (firstThreeBits === 0) return 'Synthetic';
  if (firstThreeBits === 1) return 'Key-point';
  if (firstThreeBits === 2) return 'Withheld';
  if (firstThreeBits === 3) return 'Overlap';
  return 'Unknown';
}

/**
 * Converts a number into a LASClassification
 * @param classification - the number
 * @returns - the LASClassification
 */
export function toLASClassification2(classification: number): string {
  if (classification === 0) return 'Created, Never Classified';
  if (classification === 1) return 'Unclassified';
  if (classification === 2) return 'Ground';
  if (classification === 3) return 'Low Vegetation';
  if (classification === 4) return 'Medium Vegetation';
  if (classification === 5) return 'High Vegetation';
  if (classification === 6) return 'Building';
  if (classification === 7) return 'Low Point (Noise)';
  if (classification === 8) return 'Reserved';
  if (classification === 9) return 'Water';
  if (classification === 10) return 'Rail';
  if (classification === 11) return 'Road Surface';
  if (classification === 12) return 'Reserved';
  if (classification === 13) return 'Wire – Guard (Shield)';
  if (classification === 14) return 'Wire – Conductor (Phase)';
  if (classification === 15) return 'Transmission Tower';
  if (classification === 16) return 'Wire-structure Connector (e.g. Insulator)';
  if (classification === 17) return 'Bridge Deck';
  if (classification === 18) return 'High Noise';
  if (classification >= 19 && classification <= 63) return 'Reserved';
  if (classification >= 64 && classification <= 255) return 'User Definable';
  return 'Missing';
}

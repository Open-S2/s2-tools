import { EARTH_RADIUS } from '../planets/earth';
import { angle } from '../s2/point';
import { getDistance } from '../ll';
import { degToRad, radToDeg } from 's2json-spec';

import type { LonLat } from '../ll';
import type { Point3D } from '../geometry.spec';

/**
 * This class represents a one-dimensional angle (as opposed to a
 * two-dimensional solid angle).  It has methods for converting angles to
 * or from radians, degrees, and the E5/E6/E7 representations (i.e. degrees
 * multiplied by 1e5/1e6/1e7 and rounded to the nearest integer).
 *
 * The internal representation is a double-precision value in radians, so
 * conversion to and from radians is exact.  Conversions between E5, E6, E7,
 * and Degrees are not always exact; for example, Degrees(3.1) is different
 * from E6(3100000) or E7(310000000).  However, the following properties are
 * guaranteed for any integer "n", provided that "n" is in the input range of
 * both functions:
 *
 *     Degrees(n) == E6(1000000 * n)
 *     Degrees(n) == E7(10000000 * n)
 *          E6(n) == E7(10 * n)
 *
 * The corresponding properties are *not* true for E5, so if you use E5 then
 * don't test for exact equality when comparing to other formats such as
 * Degrees or E7.
 *
 * The following conversions between degrees and radians are exact:
 *
 *          Degrees(180) == Radians(M_PI)
 *       Degrees(45 * k) == Radians(k * M_PI / 4)  for k == 0..8
 *
 * These identities also hold when the arguments are scaled up or down by any
 * power of 2.  Some similar identities are also true, for example,
 * Degrees(60) == Radians(M_PI / 3), but be aware that this type of identity
 * does not hold in general.  For example, Degrees(3) != Radians(M_PI / 60).
 *
 * Similarly, the conversion to radians means that Angle::Degrees(x).degrees()
 * does not always equal "x".  For example,
 *
 *         S1Angle::Degrees(45 * k).degrees() == 45 * k      for k == 0..8
 *   but       S1Angle::Degrees(60).degrees() != 60.
 *
 * This means that when testing for equality, you should allow for numerical
 * errors (EXPECT_DOUBLE_EQ) or convert to discrete E5/E6/E7 values first.
 *
 * CAVEAT: All of the above properties depend on "double" being the usual
 * 64-bit IEEE 754 type (which is true on almost all modern platforms).
 *
 * This class is intended to be copied by value as desired.  It uses
 * the default copy constructor and assignment operator.
 */
export type S1Angle = number;

/**
 * convert an angle in degrees to an angle in radians
 * @param angle - input angle in degrees
 * @returns - angle in radians
 */
export function fromDegrees(angle: number): S1Angle {
  return degToRad(angle);
}

/**
 * convert an angle in radians to an angle in degrees
 * @param angle - input angle in radians
 * @returns - angle in degrees
 */
export function toDegrees(angle: S1Angle): number {
  return radToDeg(angle);
}

/**
 * build an angle in E5 format.
 * @param e5_ - input angle in degrees
 * @returns - e5 angle in radians
 */
export function toE5(e5_: number): S1Angle {
  return fromDegrees(e5_ * 1e-5);
}

/**
 * build an angle in E6 format.
 * @param e6_ - input angle in degrees
 * @returns - e6 angle in radians
 */
export function toE6(e6_: number): S1Angle {
  return fromDegrees(e6_ * 1e-6);
}

/**
 * build an angle in E7 format.
 * @param e7_ - input angle in degrees
 * @returns - e7 angle in radians
 */
export function toE7(e7_: number): S1Angle {
  return fromDegrees(e7_ * 1e-7);
}

/**
 * Return the angle between two points, which is also equal to the distance
 * between these points on the unit sphere.  The points do not need to be
 * normalized.  This function has a maximum error of 3.25 * DBL_EPSILON (or
 * 2.5 * DBL_EPSILON for angles up to 1 radian). If either point is
 * zero-length (e.g. an uninitialized S2Point), or almost zero-length, the
 * resulting angle will be zero.
 * @param a - The first point
 * @param b - The second point
 * @returns - The angle between the two points in radians
 */
export function fromS2Points(a: Point3D, b: Point3D): S1Angle {
  return angle(a, b);
}
/**
 * Like the constructor above, but return the angle (i.e., distance) between
 * two S2LatLng points.  This function has about 15 digits of accuracy for
 * small distances but only about 8 digits of accuracy as the distance
 * approaches 180 degrees (i.e., nearly-antipodal points).
 * @param a - The first lon-lat pair
 * @param b - The second lon-lat pair
 * @returns - The angle between the two points in radians
 */
export function fromLonLat(a: LonLat, b: LonLat): S1Angle {
  return getDistance(a, b);
}

/**
 * convert an angle in radians to an angle in meters
 * @param angle - input angle in radians
 * @returns - angle in meters
 */
export function toMeters(angle: S1Angle): number {
  return angle * EARTH_RADIUS;
}

/**
 * convert an angle in radians to an angle in kilometers
 * @param angle - input angle in radians
 * @returns - angle in meters
 */
export function toKM(angle: S1Angle): number {
  return (angle * EARTH_RADIUS) / 1_000;
}

// Note that the E5, E6, and E7 conversion involve two multiplications rather
// than one.  This is mainly for backwards compatibility (changing this would
// break many tests), but it does have the nice side effect that conversions
// between Degrees, E6, and E7 are exact when the arguments are integers.

/**
 * Build an angle in E5 format.
 * @param angle - input angle in radians
 * @returns - an e5 angle in degrees
 */
export function e5(angle: S1Angle): number {
  return toDegrees(angle) * 1e5;
}

/**
 * Build an angle in E6 format.
 * @param angle - input angle in radians
 * @returns - an e6 angle in degrees
 */
export function e6(angle: S1Angle): number {
  return toDegrees(angle) * 1e6;
}

/**
 * Build an angle in E7 format.
 * @param angle - input angle in radians
 * @returns - an e7 angle in degrees
 */
export function e7(angle: S1Angle): number {
  return toDegrees(angle) * 1e7;
}

/**
 * Normalize this angle to the range (-180, 180] degrees.
 * @param angle - input angle in radians
 * @returns - normalized angle in radians
 */
export function normalize(angle: S1Angle): S1Angle {
  return angle % (2 * Math.PI);
}

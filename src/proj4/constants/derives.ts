import ellipsoids from './ellipsoid';
import { EPSLN, RA4, RA6, SIXTH } from './values';

import type { Ellipsoid } from './ellipsoid';

import match from '../util/match';

/** Describes an ellipsoid's eccentricity */
export interface EccentricityParams {
  a?: number;
  b?: number;
  es?: number;
  e?: number;
  ep2?: number;
  rA?: number;
}

/**
 * Derives an ellipsoid's eccentricity for an object
 * @param el - ellipsoid object to modify
 */
export function deriveEccentricity(el: EccentricityParams): void {
  let a = el.a ?? 0;
  const b = el.b ?? 0;
  let a2 = a * a; // used in geocentric
  const b2 = b * b; // used in geocentric
  let es = (a2 - b2) / a2; // e ^ 2
  let e = 0;
  if (el.rA) {
    a *= 1 - es * (SIXTH + es * (RA4 + es * RA6));
    a2 = a * a;
    es = 0;
  } else {
    e = Math.sqrt(es); // eccentricity
  }
  const ep2 = (a2 - b2) / b2; // used in geocentric

  el.es = es;
  el.e = e;
  el.ep2 = ep2;
}

/** Describes a sphere's eccentricity and if it is a true sphere or not */
export interface SphereParams {
  ellps?: string;
  a?: number;
  b?: number;
  rf?: number;
  sphere?: boolean;
}

/**
 * Builds a sphere with ellipsoid parameters
 * @param obj - an object with/wihtout sphere properties and builds the sphere
 */
export function deriveSphere(obj: SphereParams): void {
  if (obj.a === undefined) {
    // do we have an ellipsoid?
    let ellipse = match<Ellipsoid>(ellipsoids, obj.ellps);
    if (ellipse === undefined) ellipse = ellipsoids.WGS84;
    obj.a = ellipse.a;
    obj.b = ellipse.b;
    obj.rf = ellipse.rf;
  }
  if (obj.rf && obj.b === undefined) {
    obj.b = (1.0 - 1.0 / obj.rf) * obj.a;
  } else {
    obj.b = obj.a;
  }
  if (obj.rf === undefined) {
    obj.rf = (obj.a - obj.b) / obj.a;
  }
  if (obj.rf === 0 || Math.abs(obj.a - obj.b) < EPSLN) {
    obj.sphere = true;
    obj.b = obj.a;
  }
}

import { degToRad } from '../../geometry';
import { parseWKTObject } from '.';

import type { ProjectionParams } from '../../proj4';
import type { WKTObject, WKTValue } from '.';

/** Authority - EPSG code. */
export interface Authority {
  EPSG: string;
}

/** Unit - name and conversion factor. */
export interface Unit {
  name: string;
  convert: number;
  AUTHORITY: Authority;
}

/** Spheroid - name, a and rf. */
export interface Spheroid {
  name: string;
  a: number;
  rf: number;
  AUTHORITY: Authority;
}

/** Datum - name, SPHEROID, TOWGS84. */
export interface Datum {
  name: string;
  SPHEROID?: Spheroid;
  AUTHORITY: Authority;
  TOWGS84?: DatumParams;
}

/** GeoGCS - name, DATUM, PRIMEM, UNIT, AUTHORITY. */
export interface GeoGCS {
  name: string;
  DATUM?: Datum;
  PRIMEM?: Unit;
  UNIT?: Unit;
  AUTHORITY: Authority;
}

/** VertCS - name, VERT_DATUM, UNIT, AXIS. */
export interface VertCS {
  name?: string;
  VERT_DATUM?: Unit;
  UNIT?: Unit;
  AXIS?: [string, string][];
  AUTHORITY?: Authority;
}

/** Datum parameters. Can be 3 or 7 elements. */
export type DatumParams = [number, number, number, number, number, number, number];

/**
 * WKT CRS
 * The resolved CRS object from a WKT string.
 */
export interface WKTCRS extends ProjectionParams {
  type?: string;
  name?: string;
  local?: boolean;
  GEOGCS?: GeoGCS;
  DATUM?: Datum;
  PRIMEM?: Unit;
  UNIT?: Unit;
  PROJCS?: Omit<WKTCRS, 'srsCode'>;
  VERT_CS?: VertCS;
  PROJECTION?: string;
  rectified_grid_angle?: number;
  standard_parallel_1?: number;
  standard_parallel_2?: number;
  latitude_of_origin?: number;
  latitude_of_center?: number;
  longitude_of_center?: number;
  central_meridian?: number;
  false_easting?: number;
  false_northing?: number;
  AUTHORITY?: Authority;
  AXIS?: [string, string][];
  units?: string;
  to_meter?: number;
  datumCode?: string;
  ellps?: string;
  from_greenwich?: number;
  a?: number;
  b?: number;
  rf?: number;
  x0?: number;
  y0?: number;
  k0?: number;
  lat_ts?: number;
  latTs?: number;
  longc?: number;
  long0?: number;
  lat0?: number;
  lat1?: number;
  lat2?: number;
  axis?: string;
  srsCode: string;
  datum_params?: DatumParams;
  datumParams?: DatumParams;
  scale_factor?: number;
  scaleFactor?: number;
  sphere?: boolean;
  azimuth?: number;
  alpha?: number;
  projName?: string;
  toMeter?: number;
}

export const KEYWORDS = [
  'PROJCS', // projected coordinate system
  'GEOGCS', // geographic coordinate system
  'COMPD_CS', // compound coordinate system
  'VERT_CS', // vertical coordinate system
  'PROJECTEDCRS', // projected coordinate system
  'PROJCRS', // projected coordinate system
  'GEOCCS', // geographic coordinate system
  'LOCAL_CS', // local coordinate system
  'GEODCRS', // geographic coordinate system
  'GEODETICCRS', // geographic coordinate system
  'GEODETICDATUM', // geographic coordinate system
  'EDATUM', // geographic coordinate system
  'ENGINEERINGDATUM', // engineering datum
  'VERTCRS', // vertical coordinate system
  'VERTICALCRS', // vertical coordinate system
  'COMPOUNDCRS', // compound coordinate system
  'ENGINEERINGCRS', // engineering coordinate system
  'ENGCRS', // engineering coordinate system
  'FITTED_CS', // fitted coordinate system
  'LOCAL_DATUM', // local datum
  'DATUM', // datum
];

/**
 * Checks the string to see if it is a WKT projection
 * @param srsCode - WKT string
 * @returns - true if it is a WKT projection string
 */
export function isWKTProjection(srsCode: string): boolean {
  // has words with KEYWORDS in it
  return KEYWORDS.some((key) => srsCode.includes(key));
}

/**
 * Parses a WKT projection
 * @param srsCode - WKT string input
 * @returns - WKT object
 */
export function parseWKTProjection(srsCode: string): WKTCRS {
  const obj = parseWKTObject(srsCode);
  const res: Record<string, unknown> = {};
  parseProj(obj, res);
  updateProj(res as unknown as WKTCRS);
  return res as unknown as WKTCRS;
}

/**
 * Parses a WKT projection object
 * @param obj - WKT object
 * @param res - the resolved WKT object with cleaned data
 */
function parseProj(obj: WKTObject, res: Record<string, unknown>): void {
  // grab type
  const type = obj.shift();
  if (typeof type !== 'string') return;
  res.type = type;
  obj = obj[0] as WKTObject;
  // grab name
  const name = obj.shift();
  if (typeof name !== 'string') return;
  res.name = res.srsCode = name;
  // parse keywords
  buildKeywords(obj, res);
}

/**
 * Builds keywords
 * @param obj - WKT object to read from
 * @param res - the resolved WKT object with cleaned data
 */
function buildKeywords(obj: WKTObject, res: Record<string, unknown>): void {
  while (obj.length > 0) {
    const key = obj.shift();
    if (typeof key !== 'string') return;
    if (KEYWORDS.includes(key)) {
      const value = obj.shift();
      if (Array.isArray(value)) res[key] = buildSubKeywords(value);
    } else if (key === 'SPHEROID' || key === 'ELLIPSOID') {
      const value = obj.shift();
      if (Array.isArray(value)) res[key] = buildSpheroid(value);
    } else if (key === 'UNIT' || key === 'PRIMEM' || key === 'VERT_DATUM') {
      const value = obj.shift();
      if (Array.isArray(value)) res[key] = buildUnit(value);
    } else if (key === 'AUTHORITY') {
      const value = obj.shift();
      if (Array.isArray(value)) res.AUTHORITY = buildAuthority(value);
    } else if (key === 'TOWGS84') {
      const value = obj.shift();
      if (Array.isArray(value)) res.TOWGS84 = buildTOWGS84(value);
    } else if (key === 'PROJECTION') {
      const value = obj.shift();
      if (Array.isArray(value) && typeof value[0] === 'string')
        res.PROJECTION = res.projName = value[0];
    } else if (key === 'PARAMETER') {
      const param = obj.shift();
      if (!Array.isArray(param)) continue;
      const [resKey, resValue] = param;
      if (typeof resKey === 'string' && typeof resValue === 'string') {
        res[resKey] = parseFloat(resValue);
      }
    } else if (key === 'AXIS') {
      const axis = obj.shift();
      if (Array.isArray(axis)) {
        if (res.AXIS === undefined) res.AXIS = [];
        (res.AXIS as [string, string][]).push(axis as [string, string]);
      }
    }
  }
}

/**
 * Builds sub keywords for compound coordinate systems
 * @param obj - WKT object
 * @returns - GeoGCS with sub keywords parsed
 */
function buildSubKeywords(obj: WKTObject): GeoGCS {
  const [name, ...keywords] = obj;

  const res = {
    name: name as string,
  };
  buildKeywords(keywords, res);
  return res as GeoGCS;
}

/**
 * Builds a Unit object
 * @param input - WKT object
 * @returns - Unit object with appropriate values
 */
function buildUnit(input: WKTObject): Unit {
  const [name, convert, _authStr, authority] = input;
  return {
    name: name as string,
    convert: parseFloat(convert as string),
    AUTHORITY: buildAuthority(authority),
  };
}

/**
 * Builds a Spheroid object
 * @param input - WKT object
 * @returns - Spheroid object with appropriate values
 */
function buildSpheroid(input: WKTObject): Spheroid {
  const [name, a, rf, _authStr, authority] = input;
  return {
    name: name as string,
    a: parseFloat(a as string),
    rf: parseFloat(rf as string),
    AUTHORITY: buildAuthority(authority),
  };
}

/**
 * Builds an Authority object
 * @param input - WKT object
 * @returns - Authority object
 */
function buildAuthority(input?: WKTValue): Authority {
  return { EPSG: (input !== undefined ? input[1] : '') as string };
}

/**
 * Builds a TOWGS84 object (Datum Parameters)
 * @param input - WKT object
 * @returns - TOWGS84 object
 */
function buildTOWGS84(input: WKTObject): DatumParams {
  return input.map((key) => parseFloat(key as string)) as DatumParams;
}

/**
 * Update the projection to match the WKTCRS standard
 * @param wkt - the projection object to update
 */
function updateProj(wkt: WKTCRS): void {
  // adjust projName if necessary
  if (wkt.type === 'GEOGCS') {
    wkt.projName = 'longlat';
  } else if (wkt.type === 'LOCAL_CS') {
    wkt.projName = 'identity';
    wkt.local = true;
  }
  // improve axis definitions
  if (wkt.AXIS !== undefined) {
    let axisOrder = '';
    for (let i = 0, ii = wkt.AXIS.length; i < ii; ++i) {
      const axis = [wkt.AXIS[i][0].toLowerCase(), wkt.AXIS[i][1].toLowerCase()];
      if (
        axis[0].indexOf('north') !== -1 ||
        ((axis[0] === 'y' || axis[0] === 'lat') && axis[1] === 'north')
      ) {
        axisOrder += 'n';
      } else if (
        axis[0].indexOf('south') !== -1 ||
        ((axis[0] === 'y' || axis[0] === 'lat') && axis[1] === 'south')
      ) {
        axisOrder += 's';
      } else if (
        axis[0].indexOf('east') !== -1 ||
        ((axis[0] === 'x' || axis[0] === 'lon') && axis[1] === 'east')
      ) {
        axisOrder += 'e';
      } else if (
        axis[0].indexOf('west') !== -1 ||
        ((axis[0] === 'x' || axis[0] === 'lon') && axis[1] === 'west')
      ) {
        axisOrder += 'w';
      }
    }
    if (axisOrder.length === 2) {
      axisOrder += 'u';
    }
    if (axisOrder.length === 3) {
      wkt.axis = axisOrder;
    }
  }
  // unit adjustments
  if (wkt.UNIT !== undefined) {
    wkt.units = wkt.UNIT.name?.toLowerCase();
    if (wkt.units === 'metre') wkt.units = 'meter';
    if (wkt.UNIT.convert !== undefined) {
      if (wkt.type === 'GEOGCS') {
        if (wkt.DATUM !== undefined && wkt.DATUM.SPHEROID !== undefined) {
          wkt.to_meter = wkt.UNIT.convert * wkt.DATUM.SPHEROID.a;
        }
      } else {
        wkt.to_meter = wkt.UNIT.convert;
      }
    }
  }
  let geogcs: GeoGCS | undefined = wkt.GEOGCS;
  if (wkt.type === 'GEOGCS') {
    geogcs = wkt as GeoGCS;
  }
  if (geogcs !== undefined) {
    //if(wkt.GEOGCS.PRIMEM&&wkt.GEOGCS.PRIMEM.convert){
    //  wkt.from_greenwich=wkt.GEOGCS.PRIMEM.convert*D2R;
    //}
    if (geogcs.DATUM !== undefined) {
      wkt.datumCode = geogcs.DATUM.name?.toLowerCase();
    } else {
      wkt.datumCode = geogcs.name?.toLowerCase();
    }
    if (wkt.datumCode?.slice(0, 2) === 'd_') {
      wkt.datumCode = wkt.datumCode.slice(2);
    }
    if (
      wkt.datumCode === 'new_zealand_geodetic_datum_1949' ||
      wkt.datumCode === 'new_zealand_1949'
    ) {
      wkt.datumCode = 'nzgd49';
    }
    if (wkt.datumCode === 'wgs_1984' || wkt.datumCode === 'world_geodetic_system_1984') {
      if (wkt.PROJECTION === 'Mercator_Auxiliary_Sphere') {
        wkt.sphere = true;
      }
      wkt.datumCode = 'wgs84';
    }
    if (wkt.datumCode?.slice(-6) === '_ferro') {
      wkt.datumCode = wkt.datumCode.slice(0, -6);
    }
    if (wkt.datumCode?.slice(-8) === '_jakarta') {
      wkt.datumCode = wkt.datumCode.slice(0, -8);
    }
    if (~(wkt.datumCode?.indexOf('belge') ?? -1) !== 0) {
      wkt.datumCode = 'rnb72';
    }
    if (geogcs.DATUM?.SPHEROID !== undefined) {
      wkt.ellps = geogcs.DATUM.SPHEROID.name.replace('_19', '').replace(/[Cc]larke_18/, 'clrk');
      if (wkt.ellps.toLowerCase().slice(0, 13) === 'international') {
        wkt.ellps = 'intl';
      }

      wkt.a = geogcs.DATUM.SPHEROID.a;
      wkt.rf = geogcs.DATUM.SPHEROID.rf;
    }

    if (geogcs.DATUM?.TOWGS84 !== undefined) {
      wkt.datum_params = geogcs.DATUM.TOWGS84;
    }
    if (~(wkt.datumCode?.indexOf('osgb_1936') ?? -1) !== 0) {
      wkt.datumCode = 'osgb36';
    }
    if (~(wkt.datumCode?.indexOf('osni_1952') ?? -1) !== 0) {
      wkt.datumCode = 'osni52';
    }
    if (
      ~(wkt.datumCode?.indexOf('tm65') ?? -1) !== 0 ||
      ~(wkt.datumCode?.indexOf('geodetic_datum_of_1965') ?? -1) !== 0
    ) {
      wkt.datumCode = 'ire65';
    }
    if (wkt.datumCode === 'ch1903+') {
      wkt.datumCode = 'ch1903';
    }
    if (~(wkt.datumCode?.indexOf('israel') ?? -1) !== 0) {
      wkt.datumCode = 'isr93';
    }
  }
  if (wkt.b !== undefined && !isFinite(wkt.b)) {
    wkt.b = wkt.a;
  }
  /**
   * Converts input data to meters
   * @param input - meters pre-conversion
   * @returns - meters
   */
  const toMeter = (input: number): number => {
    const ratio = wkt.to_meter ?? 1;
    return input * ratio;
  };
  // remaps
  remap(wkt, 'standard_parallel_1', 'Standard_Parallel_1' as keyof WKTCRS);
  remap(wkt, 'standard_parallel_1', 'Latitude of 1st standard parallel' as keyof WKTCRS);
  remap(wkt, 'standard_parallel_2', 'Standard_Parallel_2' as keyof WKTCRS);
  remap(wkt, 'standard_parallel_2', 'Latitude of 2nd standard parallel' as keyof WKTCRS);
  remap(wkt, 'rectified_grid_angle', 'Rectified_Grid_Angle' as keyof WKTCRS);
  remap(wkt, 'rectifiedGridAngle', 'rectified_grid_angle' as keyof WKTCRS);
  remap(wkt, 'false_easting', 'False_Easting' as keyof WKTCRS);
  remap(wkt, 'false_easting', 'easting' as keyof WKTCRS);
  remap(wkt, 'false_easting', 'Easting at false origin' as keyof WKTCRS);
  remap(wkt, 'false_northing', 'False_Northing' as keyof WKTCRS);
  remap(wkt, 'false_northing', 'False northing' as keyof WKTCRS);
  remap(wkt, 'false_northing', 'Northing at false origin' as keyof WKTCRS);
  remap(wkt, 'central_meridian', 'Central_Meridian' as keyof WKTCRS);
  remap(wkt, 'central_meridian', 'Longitude of natural origin' as keyof WKTCRS);
  remap(wkt, 'central_meridian', 'Longitude of false origin' as keyof WKTCRS);
  remap(wkt, 'latitude_of_origin', 'Latitude_Of_Origin' as keyof WKTCRS);
  remap(wkt, 'latitude_of_origin', 'Central_Parallel' as keyof WKTCRS);
  remap(wkt, 'latitude_of_origin', 'Latitude of natural origin' as keyof WKTCRS);
  remap(wkt, 'latitude_of_origin', 'Latitude of false origin' as keyof WKTCRS);
  remap(wkt, 'scale_factor', 'Scale_Factor' as keyof WKTCRS);
  remap(wkt, 'latitude_of_center', 'Latitude_Of_Center' as keyof WKTCRS);
  remap(wkt, 'latitude_of_center', 'Latitude_of_center' as keyof WKTCRS);
  remap(wkt, 'lat0', 'latitude_of_center', degToRad);
  remap(wkt, 'longitude_of_center', 'Longitude_Of_Center' as keyof WKTCRS);
  remap(wkt, 'longitude_of_center', 'Longitude_of_center' as keyof WKTCRS);
  remap(wkt, 'longc', 'longitude_of_center', degToRad);
  remap(wkt, 'x0', 'false_easting', toMeter);
  remap(wkt, 'y0', 'false_northing', toMeter);
  remap(wkt, 'long0', 'central_meridian', degToRad);
  remap(wkt, 'lat0', 'latitude_of_origin', degToRad);
  remap(wkt, 'lat0', 'standard_parallel_1', degToRad);
  remap(wkt, 'lat1', 'standard_parallel_1', degToRad);
  remap(wkt, 'lat2', 'standard_parallel_2', degToRad);
  remap(wkt, 'azimuth', 'Azimuth' as keyof WKTCRS);
  remap(wkt, 'alpha', 'azimuth', degToRad);
  // uppercase all
  remap(wkt, 'toMeter', 'to_meter');
  remap(wkt, 'fromGreenwich', 'from_greenwich');
  // latTS, datumParams, and scaleFactor
  remap(wkt, 'latTs', 'lat_ts', degToRad);
  remap(wkt, 'datumParams', 'datum_params');
  remap(wkt, 'scaleFactor', 'scale_factor');
  remap(wkt, 'k0', 'scaleFactor');
  // update long0 if applicable
  if (
    wkt.long0 === undefined &&
    wkt.longc !== undefined &&
    (wkt.projName === 'Albers_Conic_Equal_Area' || wkt.projName === 'Lambert_Azimuthal_Equal_Area')
  ) {
    wkt.long0 = wkt.longc;
  }
  // update lat_ts and lat0 for polar stereographic
  if (
    wkt.lat_ts === undefined &&
    wkt.lat1 !== undefined &&
    ['Stereographic_South_Pole', 'Polar Stereographic (variant B)'].includes(wkt.projName ?? '')
  ) {
    wkt.lat0 = degToRad(wkt.lat1 > 0 ? 90 : -90);
    wkt.lat_ts = wkt.latTs = wkt.lat1;
  } else if (
    wkt.lat_ts === undefined &&
    wkt.lat0 !== undefined &&
    wkt.projName === 'Polar_Stereographic'
  ) {
    wkt.lat_ts = wkt.latTs = wkt.lat0;
    wkt.lat0 = degToRad(wkt.lat0 > 0 ? 90 : -90);
  }
}

/**
 * Only update the to key if it did not exist
 * @param input - input object
 * @param to - keys to update
 * @param from - keys to remap
 * @param updateFun - function guide on how to update the value
 */
function remap(
  input: WKTCRS,
  to: keyof WKTCRS,
  from: keyof WKTCRS,
  updateFun?: (value: number) => number,
): void {
  if (input[to] === undefined && input[from] !== undefined) {
    // @ts-expect-error - its ok to remap the key
    input[to] = updateFun !== undefined ? updateFun(input[from] as number) : input[from];
  }
}

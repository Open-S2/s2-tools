import { Satellite } from '../sat';
import { pi, twoPi } from '../util/constants';

/** Options for Dpper */
export interface DpperOptions {
  init: boolean;
  ep: number;
  inclp: number;
  nodep: number;
  argpp: number;
  mp: number;
}

/** Output for Dpper */
export interface DpperOutput {
  ep: number;
  inclp: number;
  nodep: number;
  argpp: number;
  mp: number;
}

/**
 *                           procedure dpper
 *
 *  this procedure provides deep space long period periodic contributions
 *    to the mean elements.  by design, these periodics are zero at epoch.
 *    this used to be dscom which included initialization, but it's really a
 *    recurring function.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    e3          -
 *    ee2         -
 *    peo         -
 *    pgho        -
 *    pho         -
 *    pinco       -
 *    plo         -
 *    se2 , se3 , sgh2, sgh3, sgh4, sh2, sh3, si2, si3, sl2, sl3, sl4 -
 *    t           -
 *    xh2, xh3, xi2, xi3, xl2, xl3, xl4 -
 *    zmol        -
 *    zmos        -
 *    ep          - eccentricity                           0.0 - 1.0
 *    inclo       - inclination - needed for lyddane modification
 *    nodep       - right ascension of ascending node
 *    argpp       - argument of perigee
 *    mp          - mean anomaly
 *
 *  outputs       :
 *    ep          - eccentricity                           0.0 - 1.0
 *    inclp       - inclination
 *    nodep        - right ascension of ascending node
 *    argpp       - argument of perigee
 *    mp          - mean anomaly
 *
 *  locals        :
 *    alfdp       -
 *    betdp       -
 *    cosip  , sinip  , cosop  , sinop  ,
 *    dalf        -
 *    dbet        -
 *    dls         -
 *    f2, f3      -
 *    pe          -
 *    pgh         -
 *    ph          -
 *    pinc        -
 *    pl          -
 *    sel   , ses   , sghl  , sghs  , shl   , shs   , sil   , sinzf , sis   ,
 *    sll   , sls
 *    xls         -
 *    xnoh        -
 *    zf          -
 *    zm          -
 *
 *  coupling      :
 *    none.
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report #3 1980
 *    hoots, norad spacetrack report #6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 * @param sat - Satellite object
 * @param options - dpper options
 * @param tsince - time in minutes since epoch
 * @returns - deep space long period periodic contributions
 */
export function dpper(
  sat: Satellite,
  options: DpperOptions,
  tsince: number, // defaults to 0 (sgp4init doesn't set a time)
): DpperOutput {
  const {
    e3,
    ee2,
    peo,
    pgho,
    pho,
    pinco,
    plo,
    se2,
    se3,
    sgh2,
    sgh3,
    sgh4,
    sh2,
    sh3,
    si2,
    si3,
    sl2,
    sl3,
    sl4,
    xgh2,
    xgh3,
    xgh4,
    xh2,
    xh3,
    xi2,
    xi3,
    xl2,
    xl3,
    xl4,
    zmol,
    zmos,
    opsmode,
  } = sat;

  const { init } = options;

  let { ep, inclp, nodep, argpp, mp } = options;

  // Copy satellite attributes into local variables for convenience
  // and symmetry in writing formulae.

  let alfdp: number;
  let betdp: number;
  let cosip: number;
  let sinip: number;
  let cosop: number;
  let sinop: number;
  let dalf: number;
  let dbet: number;
  let dls: number;
  let f2: number;
  let f3: number;
  let pe: number;
  let pgh: number;
  let ph: number;
  let pinc: number;
  let pl: number;
  let sinzf: number;
  let xls: number;
  let xnoh: number;
  let zf: number;
  let zm: number;

  //  ---------------------- constants -----------------------------
  const zns = 1.19459e-5;
  const zes = 0.01675;
  const znl = 1.5835218e-4;
  const zel = 0.0549;

  //  --------------- calculate time varying periodics -----------
  zm = zmos + zns * tsince;

  // be sure that the initial call has time set to zero
  if (init) zm = zmos;
  zf = zm + 2.0 * zes * Math.sin(zm);
  sinzf = Math.sin(zf);
  f2 = 0.5 * sinzf * sinzf - 0.25;
  f3 = -0.5 * sinzf * Math.cos(zf);

  const ses = se2 * f2 + se3 * f3;
  const sis = si2 * f2 + si3 * f3;
  const sls = sl2 * f2 + sl3 * f3 + sl4 * sinzf;
  const sghs = sgh2 * f2 + sgh3 * f3 + sgh4 * sinzf;
  const shs = sh2 * f2 + sh3 * f3;

  zm = zmol + znl * tsince;
  if (init) {
    zm = zmol;
  }

  zf = zm + 2.0 * zel * Math.sin(zm);
  sinzf = Math.sin(zf);
  f2 = 0.5 * sinzf * sinzf - 0.25;
  f3 = -0.5 * sinzf * Math.cos(zf);

  const sel = ee2 * f2 + e3 * f3;
  const sil = xi2 * f2 + xi3 * f3;
  const sll = xl2 * f2 + xl3 * f3 + xl4 * sinzf;
  const sghl = xgh2 * f2 + xgh3 * f3 + xgh4 * sinzf;
  const shll = xh2 * f2 + xh3 * f3;

  pe = ses + sel;
  pinc = sis + sil;
  pl = sls + sll;
  pgh = sghs + sghl;
  ph = shs + shll;

  if (!init) {
    pe -= peo;
    pinc -= pinco;
    pl -= plo;
    pgh -= pgho;
    ph -= pho;
    inclp += pinc;
    ep += pe;
    sinip = Math.sin(inclp);
    cosip = Math.cos(inclp);

    /* ----------------- apply periodics directly ------------ */
    // sgp4fix for lyddane choice
    // strn3 used original inclination - this is technically feasible
    // gsfc used perturbed inclination - also technically feasible
    // probably best to readjust the 0.2 limit value and limit discontinuity
    // 0.2 rad = 11.45916 deg
    // use next line for original strn3 approach and original inclination
    // if (inclo >= 0.2)
    // use next line for gsfc version and perturbed inclination
    if (inclp >= 0.2) {
      ph /= sinip;
      pgh -= cosip * ph;
      argpp += pgh;
      nodep += ph;
      mp += pl;
    } else {
      //  ---- apply periodics with lyddane modification ----
      sinop = Math.sin(nodep);
      cosop = Math.cos(nodep);
      alfdp = sinip * sinop;
      betdp = sinip * cosop;
      dalf = ph * cosop + pinc * cosip * sinop;
      dbet = -ph * sinop + pinc * cosip * cosop;
      alfdp += dalf;
      betdp += dbet;
      nodep %= twoPi;

      //  sgp4fix for afspc written intrinsic functions
      //  nodep used without a trigonometric function ahead
      if (nodep < 0.0 && opsmode === 'a') {
        nodep += twoPi;
      }
      xls = mp + argpp + cosip * nodep;
      dls = pl + pgh - pinc * nodep * sinip;
      xls += dls;
      xnoh = nodep;
      nodep = Math.atan2(alfdp, betdp);

      //  sgp4fix for afspc written intrinsic functions
      //  nodep used without a trigonometric function ahead
      if (nodep < 0.0 && opsmode === 'a') {
        nodep += twoPi;
      }
      if (Math.abs(xnoh - nodep) > pi) {
        if (nodep < xnoh) {
          nodep += twoPi;
        } else {
          nodep -= twoPi;
        }
      }
      mp += pl;
      argpp = xls - mp - cosip * nodep;
    }
  }

  return {
    ep,
    inclp,
    nodep,
    argpp,
    mp,
  };
}

import { earthRadius, j2, j3oj2, pi, twoPi, vkmpersec, x2o3, xke } from '../util/constants';

import { Satellite } from '../sat';
import { dpper } from './dpper';
import { dspace } from './dspace';

/** An error output from an sgp4 computation */
export interface SGP4ErrorOutput {
  type: number;
  error: string;
}

/** A successful output from an sgp4 computation */
export interface SGP4Output {
  position: {
    x: number;
    y: number;
    z: number;
  };
  velocity: {
    x: number;
    y: number;
    z: number;
  };
}

/**
 *                             procedure sgp4
 *
 *  this procedure is the sgp4 prediction model from space command. this is an
 *    updated and combined version of sgp4 and sdp4, which were originally
 *    published separately in spacetrack report //3. this version follows the
 *    methodology from the aiaa paper (2006) describing the history and
 *    development of the code.
 *
 *  author        : david vallado                  719-573-2600   28 jun 2005
 *
 *  inputs        :
 *    tle  - initialised structure from sgp4init() call.
 *    tsince  - time since epoch (minutes)
 *
 *  outputs       :
 *    r           - position vector                     km
 *    v           - velocity                            km/sec
 *  return code - non-zero on error.
 *                   1 - mean elements, ecc >= 1.0 or ecc < -0.001 or a < 0.95 er
 *                   2 - mean motion less than 0.0
 *                   3 - pert elements, ecc < 0.0  or  ecc > 1.0
 *                   4 - semi-latus rectum < 0.0
 *                   5 - epoch elements are sub-orbital
 *                   6 - satellite has decayed
 *
 *  locals        :
 *    am          -
 *    axnl, aynl        -
 *    betal       -
 *    cosim   , sinim   , cosomm  , sinomm  , cnod    , snod    , cos2u   ,
 *    sin2u   , coseo1  , sineo1  , cosi    , sini    , cosip   , sinip   ,
 *    cosisq  , cossu   , sinsu   , cosu    , sinu
 *    delm        -
 *    delomg      -
 *    dndt        -
 *    eccm        -
 *    emsq        -
 *    ecose       -
 *    el2         -
 *    eo1         -
 *    eccp        -
 *    esine       -
 *    argpm       -
 *    argpp       -
 *    omgadf      -
 *    pl          -
 *    r           -
 *    rtemsq      -
 *    rdotl       -
 *    rl          -
 *    rvdot       -
 *    rvdotl      -
 *    su          -
 *    t2  , t3   , t4    , tc
 *    tem5, temp , temp1 , temp2  , tempa  , tempe  , templ
 *    u   , ux   , uy    , uz     , vx     , vy     , vz
 *    inclm       - inclination
 *    mm          - mean anomaly
 *    nm          - mean motion
 *    nodem       - right asc of ascending node
 *    xinc        -
 *    xincp       -
 *    xl          -
 *    xlm         -
 *    mp          -
 *    xmdf        -
 *    xmx         -
 *    xmy         -
 *    nodedf      -
 *    xnode       -
 *    nodep       -
 *    np          -
 *
 *  coupling      :
 *    getgravconst-
 *    dpper
 *    dspace
 *
 *  references    :
 *    hoots, roehrich, norad spacetrack report //3 1980
 *    hoots, norad spacetrack report //6 1986
 *    hoots, schumacher and glover 2004
 *    vallado, crawford, hujsak, kelso  2006
 * @param sat - the satellite object to propagate
 * @param tsince - the time since the epoch
 * @returns - the position and velocity of the satellite or an error report
 */
export function sgp4(sat: Satellite, tsince: number): SGP4ErrorOutput | SGP4Output {
  const {
    anomaly,
    motion,
    eccentricity,
    inclination,
    method,
    drag,
    mdot,
    perigee,
    argpdot,
    ascension,
    nodedot,
    nodecf,
    cc1,
    cc4,
    cc5,
    t2cof,
    isimp,
    omgcof,
    eta,
    xmcof,
    delmo,
    d2,
    d3,
    d4,
    sinmao,
    t3cof,
    t4cof,
    t5cof,
    irez,
    d2201,
    d2211,
    d3210,
    d3222,
    d4410,
    d4422,
    d5220,
    d5232,
    d5421,
    d5433,
    dedt,
    del1,
    del2,
    del3,
    didt,
    dmdt,
    dnodt,
    domdt,
    opsmode,
    gsto,
    xfact,
    xlamo,
    atime,
    xli,
    xni,
  } = sat;

  let { aycof, xlcof, con41, x1mth2, x7thm1 } = sat;

  let coseo1 = 0;
  let sineo1 = 0;
  let cosip: number;
  let sinip: number;
  let cosisq: number;
  let delm: number;
  let delomg: number;
  let eo1: number;
  let argpm: number;
  let argpp: number;
  let su: number;
  let t3: number;
  let t4: number;
  let tc: number;
  let tem5: number;
  let temp: number;
  let tempa: number;
  let tempe: number;
  let templ: number;
  let inclm: number;
  let mm: number;
  let nm: number;
  let nodem: number;
  let xincp: number;
  let xlm: number;
  let mp: number;
  let nodep: number;

  /* ------------------ set mathematical constants --------------- */
  // sgp4fix divisor for divide by zero check on inclination
  // the old check used 1.0 + cos(pi-1.0e-9), but then compared it to
  // 1.5 e-12, so the threshold was changed to 1.5e-12 for consistency

  const temp4 = 1.5e-12;

  //  ------- update for secular gravity and atmospheric drag -----
  const xmdf = anomaly + mdot * tsince;
  const argpdf = perigee + argpdot * tsince;
  const nodedf = ascension + nodedot * tsince;
  argpm = argpdf;
  mm = xmdf;
  const t2 = tsince * tsince;
  nodem = nodedf + nodecf * t2;
  tempa = 1.0 - cc1 * tsince;
  tempe = drag * cc4 * tsince;
  templ = t2cof * t2;

  if (isimp !== 1) {
    delomg = omgcof * tsince;
    //  sgp4fix use mutliply for speed instead of pow
    const delmtemp = 1.0 + eta * Math.cos(xmdf);
    delm = xmcof * (delmtemp * delmtemp * delmtemp - delmo);
    temp = delomg + delm;
    mm = xmdf + temp;
    argpm = argpdf - temp;
    t3 = t2 * tsince;
    t4 = t3 * tsince;
    tempa = tempa - d2 * t2 - d3 * t3 - d4 * t4;
    tempe += drag * cc5 * (Math.sin(mm) - sinmao);
    templ = templ + t3cof * t3 + t4 * (t4cof + tsince * t5cof);
  }
  nm = motion;
  let em = eccentricity;
  inclm = inclination;
  if (method === 'd') {
    tc = tsince;

    const dspaceOptions = {
      irez,
      d2201,
      d2211,
      d3210,
      d3222,
      d4410,
      d4422,
      d5220,
      d5232,
      d5421,
      d5433,
      dedt,
      del1,
      del2,
      del3,
      didt,
      dmdt,
      dnodt,
      domdt,
      argpo: perigee,
      argpdot,
      tc,
      gsto,
      xfact,
      xlamo,
      no: motion,
      atime,
      em,
      argpm,
      inclm,
      xli,
      mm,
      xni,
      nodem,
      nm,
    };

    const dspaceResult = dspace(dspaceOptions, tsince);

    ({ em, argpm, inclm, mm, nodem, nm } = dspaceResult);
  }

  if (nm <= 0.0) {
    // sgp4fix add return
    return {
      type: 2,
      error: `error nm ${nm}`,
    };
  }

  const am = (xke / nm) ** x2o3 * tempa * tempa;
  nm = xke / am ** 1.5;
  em -= tempe;

  // fix tolerance for error recognition
  // sgp4fix am is fixed from the previous nm check
  if (em >= 1.0 || em < -0.001) {
    // || (am < 0.95)
    // sgp4fix to return if there is an error in eccentricity
    return {
      type: 1,
      error: `error em ${em}`,
    };
  }

  //  sgp4fix fix tolerance to avoid a divide by zero
  if (em < 1.0e-6) {
    em = 1.0e-6;
  }
  mm += motion * templ;
  xlm = mm + argpm + nodem;

  nodem %= twoPi;
  argpm %= twoPi;
  xlm %= twoPi;
  mm = (xlm - argpm - nodem) % twoPi;

  // ----------------- compute extra mean quantities -------------
  const sinim = Math.sin(inclm);
  const cosim = Math.cos(inclm);

  // -------------------- add lunar-solar periodics --------------
  let ep = em;
  xincp = inclm;
  argpp = argpm;
  nodep = nodem;
  mp = mm;
  sinip = sinim;
  cosip = cosim;
  if (method === 'd') {
    const dpperParameters = {
      init: false,
      ep,
      inclp: xincp,
      nodep,
      argpp,
      mp,
      opsmode,
    };
    const dpperResult = dpper(sat, dpperParameters, tsince);

    ({ ep, nodep, argpp, mp } = dpperResult);

    xincp = dpperResult.inclp;

    if (xincp < 0.0) {
      xincp = -xincp;
      nodep += pi;
      argpp -= pi;
    }
    if (ep < 0.0 || ep > 1.0) {
      //  sgp4fix add return
      return {
        type: 3,
        error: `error ep ${ep}`,
      };
    }
  }

  //  -------------------- long period periodics ------------------
  if (method === 'd') {
    sinip = Math.sin(xincp);
    cosip = Math.cos(xincp);
    aycof = -0.5 * j3oj2 * sinip;

    //  sgp4fix for divide by zero for xincp = 180 deg
    if (Math.abs(cosip + 1.0) > 1.5e-12) {
      xlcof = (-0.25 * j3oj2 * sinip * (3.0 + 5.0 * cosip)) / (1.0 + cosip);
    } else {
      xlcof = (-0.25 * j3oj2 * sinip * (3.0 + 5.0 * cosip)) / temp4;
    }
  }

  const axnl = ep * Math.cos(argpp);
  temp = 1.0 / (am * (1.0 - ep * ep));
  const aynl = ep * Math.sin(argpp) + temp * aycof;
  const xl = mp + argpp + nodep + temp * xlcof * axnl;

  // --------------------- solve kepler's equation ---------------
  const u = (xl - nodep) % twoPi;
  eo1 = u;
  tem5 = 9999.9;
  let ktr = 1;

  //    sgp4fix for kepler iteration
  //    the following iteration needs better limits on corrections
  while (Math.abs(tem5) >= 1.0e-12 && ktr <= 10) {
    sineo1 = Math.sin(eo1);
    coseo1 = Math.cos(eo1);
    tem5 = 1.0 - coseo1 * axnl - sineo1 * aynl;
    tem5 = (u - aynl * coseo1 + axnl * sineo1 - eo1) / tem5;
    if (Math.abs(tem5) >= 0.95) {
      if (tem5 > 0.0) {
        tem5 = 0.95;
      } else {
        tem5 = -0.95;
      }
    }
    eo1 += tem5;
    ktr += 1;
  }

  //  ------------- short period preliminary quantities -----------
  const ecose = axnl * coseo1 + aynl * sineo1;
  const esine = axnl * sineo1 - aynl * coseo1;
  const el2 = axnl * axnl + aynl * aynl;
  const pl = am * (1.0 - el2);
  if (pl < 0.0) {
    //  sgp4fix add return
    return {
      type: 4,
      error: `error pl ${pl}`,
    };
  }

  const rl = am * (1.0 - ecose);
  const rdotl = (Math.sqrt(am) * esine) / rl;
  const rvdotl = Math.sqrt(pl) / rl;
  const betal = Math.sqrt(1.0 - el2);
  temp = esine / (1.0 + betal);
  const sinu = (am / rl) * (sineo1 - aynl - axnl * temp);
  const cosu = (am / rl) * (coseo1 - axnl + aynl * temp);
  su = Math.atan2(sinu, cosu);
  const sin2u = (cosu + cosu) * sinu;
  const cos2u = 1.0 - 2.0 * sinu * sinu;
  temp = 1.0 / pl;
  const temp1 = 0.5 * j2 * temp;
  const temp2 = temp1 * temp;

  // -------------- update for short period periodics ------------
  if (method === 'd') {
    cosisq = cosip * cosip;
    con41 = 3.0 * cosisq - 1.0;
    x1mth2 = 1.0 - cosisq;
    x7thm1 = 7.0 * cosisq - 1.0;
  }

  const mrt = rl * (1.0 - 1.5 * temp2 * betal * con41) + 0.5 * temp1 * x1mth2 * cos2u;

  // sgp4fix for decaying satellites
  if (mrt < 1.0) {
    return {
      type: 6,
      error: `decay condition ${mrt}`,
    };
  }

  su -= 0.25 * temp2 * x7thm1 * sin2u;
  const xnode = nodep + 1.5 * temp2 * cosip * sin2u;
  const xinc = xincp + 1.5 * temp2 * cosip * sinip * cos2u;
  const mvt = rdotl - (nm * temp1 * x1mth2 * sin2u) / xke;
  const rvdot = rvdotl + (nm * temp1 * (x1mth2 * cos2u + 1.5 * con41)) / xke;

  // --------------------- orientation vectors -------------------
  const sinsu = Math.sin(su);
  const cossu = Math.cos(su);
  const snod = Math.sin(xnode);
  const cnod = Math.cos(xnode);
  const sini = Math.sin(xinc);
  const cosi = Math.cos(xinc);
  const xmx = -snod * cosi;
  const xmy = cnod * cosi;
  const ux = xmx * sinsu + cnod * cossu;
  const uy = xmy * sinsu + snod * cossu;
  const uz = sini * sinsu;
  const vx = xmx * cossu - cnod * sinsu;
  const vy = xmy * cossu - snod * sinsu;
  const vz = sini * cossu;

  // --------- position and velocity (in km and km/sec) ----------
  const r = {
    x: mrt * ux * earthRadius,
    y: mrt * uy * earthRadius,
    z: mrt * uz * earthRadius,
  };
  const v = {
    x: (mvt * ux + rvdot * vx) * vkmpersec,
    y: (mvt * uy + rvdot * vy) * vkmpersec,
    z: (mvt * uz + rvdot * vz) * vkmpersec,
  };

  return {
    position: r,
    velocity: v,
  };
}

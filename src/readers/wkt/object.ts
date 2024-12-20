import { cleanString } from '.';

/** WKT value or array of values */
export type WKTValue = string | WKTValue[];
/** WKT object is a collection of WKT values or even nested WKT objects */
export type WKTObject = WKTValue[];

/**
 * Parses a WKT object
 * @param wktStr - WKT string
 * @returns - WKT object
 */
export function parseWKTObject(wktStr: string): WKTObject {
  const res: WKTObject = [];
  _parseWKTObject(wktStr, res);
  return res;
}

/**
 * Parse a WKT object
 * @param wktStr - WKT string
 * @param res - collection to store the values
 * @returns - a sliced WKT string with the parsed values
 */
function _parseWKTObject(wktStr: string, res: WKTObject): string {
  // first get the object name and build the residual
  while (wktStr.length > 0) {
    let commaIndex = wktStr.indexOf(',');
    let startBracketIndex = wktStr.indexOf('[');
    const endBracketIndex = wktStr.indexOf(']');
    if (commaIndex === -1) commaIndex = Infinity;
    if (startBracketIndex === -1) startBracketIndex = Infinity;
    if (commaIndex < Math.min(startBracketIndex, endBracketIndex)) {
      // store the value
      const key = wktStr.slice(0, commaIndex);
      if (key.length > 0) res.push(cleanString(key));
      wktStr = wktStr.slice(commaIndex + 1);
    } else if (startBracketIndex < endBracketIndex) {
      // store the object
      const key = wktStr.slice(0, startBracketIndex);
      const arr: WKTObject = [];
      wktStr = _parseWKTObject(wktStr.slice(startBracketIndex + 1), arr);
      res.push(cleanString(key), arr);
    } else {
      // store the LAST value if it exists, be sure to increment past the bracket for this recursive call
      if (endBracketIndex > 0) {
        const key = cleanString(wktStr.slice(0, endBracketIndex));
        if (key.length > 0) res.push(key);
        wktStr = wktStr.slice(endBracketIndex + 1);
      } else {
        wktStr = wktStr.slice(1);
      }
      return wktStr;
    }
  }
  // hit the end
  return wktStr;
}

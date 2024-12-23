import { getTemplate5 } from './templates';
import { lookupTable50 } from './tables';

import type { Reader } from '../../..';

export * from './templates';

/** The output of `parseSection5` */
export type DataRepresentationSection = ReturnType<typeof parseSection5>;

/**
 *  Data Representation Section
 *
 * [Read more...](https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_sect5.shtml)
 * @param section - The raw section data to parse
 * @returns - Parsed Data Representation Information
 */
export function parseSection5(section: Reader) {
  const dataRepresentationTemplate = section.getUint16(9);
  const dataRepresentation = getTemplate5(dataRepresentationTemplate)(section); // lookupTemplate5

  return {
    /** Number of GRIB section */
    sectionNumber: section.getUint8(4),
    /** Name of Grib section */
    sectionName: 'Data Representation Section' as const,
    /** Length of GRIB section */
    length: section.getUint32(0),
    /** Number of data points where one or more values are specified in Section 7 when a bit map is present, total number of data points when a bit map is absent. */
    numberOfDataPoints: section.getUint32(5),
    /** Data representation template number (See [Table 5.0](https://www.nco.ncep.noaa.gov/pmb/docs/grib2/grib2_doc/grib2_table5-0.shtml)) */
    dataRepresentationTemplate: {
      code: dataRepresentationTemplate,
      description: lookupTable50[dataRepresentationTemplate],
    },
    /** Data representation built using a template */
    dataRepresentation,
  };
}
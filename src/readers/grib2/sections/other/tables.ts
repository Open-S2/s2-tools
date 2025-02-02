/**
 * # ON388 - TABLE A - GENERATING PROCESS OR MODEL
 *
 * **Details**:
 * - **Originating Center**: 7 (US-NWS, NCEP)
 * - **GRIB2 - Product Definition Template in Octet**: 14
 * - **Revised**: 05/26/2023
 *
 * **Reserved Ranges**:
 * - `0-1`: Reserved
 * - `7-9`: Reserved
 * - `19`: Reserved
 * - `24`: Reserved
 * - `26-29`: Reserved
 * - `32-41`: Reserved
 * - `50-51`: Reserved
 * - `53-63`: Reserved
 * - `65-67`: Reserved
 * - `79`: Reserved
 * - `102-103`: Reserved
 * - `106`: Reserved
 * - `142-149`: Reserved
 * - `194`: Reserved
 * - `202-209`: Reserved
 * - `212-214`: Reserved
 * - `216-219`: Reserved
 * - `221-230`: Reserved for WPC products
 * - `231-254`: Reserved
 *
 * **Special Value**:
 * - `255`: Missing
 *
 * ## Description
 * This table defines the data template definitions used by Originating Center 7 (US-NWS, NCEP) in GRIB2 files,
 * specifying various generating processes or models and their corresponding template references.
 *
 * ## Notes
 * - Red text depicts changes made since 01/25/2022
 */
export const grib2LookupTableA: Record<number, string> = {
  // 0-1: Reserved
  2: 'Ultra Violet Index Model',
  3: 'NCEP/ARL Transport and Dispersion Model',
  4: 'NCEP/ARL Smoke Model',
  5: 'Satellite Derived Precipitation and temperatures, from IR (See PDS Octet 41 ... for specific satellite ID)',
  6: 'NCEP/ARL Dust Model',
  // 7-9: Reserved
  10: 'Global Wind-Wave Forecast Model',
  11: 'Global Multi-Grid Wave Model (Static Grids)',
  12: 'Probabilistic Storm Surge (P-Surge)',
  13: 'Hurricane Multi-Grid Wave Model',
  14: 'Extra-tropical Storm Surge Atlantic Domain',
  15: 'Nearshore Wave Prediction System (NWPS)',
  16: 'Extra-Tropical Storm Surge (ETSS)',
  17: 'Extra-tropical Storm Surge Pacific Domain',
  18: 'Probabilistic Extra-Tropical Storm Surge (P-ETSS)',
  // 19: Reserved
  20: 'Extra-tropical Storm Surge Micronesia Domain',
  21: 'Extra-tropical Storm Surge Atlantic Domain (3D)',
  22: 'Extra-tropical Storm Surge Pacific Domain (3D)',
  23: 'Extra-tropical Storm Surge Micronesia Domain (3D)',
  // 24: Reserved
  25: 'Snow Cover Analysis',
  // 26-29: Reserved
  30: 'Forecaster generated field',
  31: 'Value added post processed field',
  // 32-41: Reserved
  42: 'Global Optimum Interpolation Analysis (GOI) from GFS model',
  43: 'Global Optimum Interpolation Analysis (GOI) from "Final" run',
  44: 'Sea Surface Temperature Analysis',
  45: 'Coastal Ocean Circulation Model',
  46: 'HYCOM - Global',
  47: 'HYCOM - North Pacific basin',
  48: 'HYCOM - North Atlantic basin',
  49: 'Ozone Analysis from TIROS Observations',
  // 50-51: Reserved
  52: 'Ozone Analysis from Nimbus 7 Observations',
  // 53-63: Reserved
  64: 'Regional Optimum Interpolation Analysis (ROI)',
  // 65-67: Reserved
  68: '80 wave triangular, 18-layer Spectral model from GFS model',
  69: '80 wave triangular, 18 layer Spectral model from "Medium Range Forecast" run',
  70: 'Quasi-Lagrangian Hurricane Model (QLM)',
  71: 'Hurricane Weather Research and Forecasting (HWRF)',
  72: 'Hurricane Non-Hydrostatic Multiscale Model on the B Grid (HNMMB)',
  73: 'Fog Forecast model - Ocean Prod. Center',
  74: 'Gulf of Mexico Wind/Wave',
  75: 'Gulf of Alaska Wind/Wave',
  76: 'Bias corrected Medium Range Forecast',
  77: '126 wave triangular, 28 layer Spectral model from GFS model',
  78: '126 wave triangular, 28 layer Spectral model from "Medium Range Forecast" run',
  // 79: Reserved
  80: '62 wave triangular, 28 layer Spectral model from "Medium Range Forecast" run',
  81: 'Analysis from GFS (Global Forecast System)',
  82: 'Analysis from GDAS (Global Data Assimilation System)',
  83: 'High Resolution Rapid Refresh (HRRR)',
  84: 'MESO NAM Model (currently 12 km)',
  85: 'Real Time Ocean Forecast System (RTOFS)',
  86: 'Early Hurricane Wind Speed Probability Model',
  87: 'CAC Ensemble Forecasts from Spectral (ENSMB)',
  88: 'NOAA Wave Watch III (NWW3) Ocean Wave Model',
  89: 'Non-hydrostatic Meso Model (NMM) (Currently 8 km)',
  90: '62 wave triangular, 28 layer spectral model extension of the "Medium Range Forecast" run',
  91: '62 wave triangular, 28 layer spectral model extension of the GFS model',
  92: '62 wave triangular, 28 layer spectral model run from the "Medium Range Forecast" final analysis',
  93: '62 wave triangular, 28 layer spectral model run from the T62 GDAS analysis of the "Medium Range Forecast" run',
  94: 'T170/L42 Global Spectral Model from MRF run',
  95: 'T126/L42 Global Spectral Model from MRF run',
  96: 'Global Forecast System Model. T1534 - Forecast hours 00-384; T574 - Forecast hours 00-192; T190 - Forecast hours 204-384',
  // 97: Reserved
  98: 'Climate Forecast System Model -- Atmospheric model (GFS) coupled to a multi level ocean model. Currently GFS spectral model at T62, 64 levels coupled to 40 level MOM3 ocean model.',
  99: 'Miscellaneous Test ID',
  100: 'Miscellaneous Test ID',
  101: 'Conventional Observation Re-Analysis (CORE)',
  // 102-103: Reserved
  104: 'National Blend GRIB',
  105: 'Rapid Refresh (RAP)',
  // 106: Reserved
  107: 'Global Ensemble Forecast System (GEFS)',
  108: 'Localized Aviation MOS Program (LAMP)',
  109: 'Real Time Mesoscale Analysis (RTMA)',
  110: 'NAM Model - 15km version',
  111: 'NAM model, generic resolution (Used in SREF processing)',
  112: 'WRF-NMM model, generic resolution (Used in various runs) NMM=Nondydrostatic Mesoscale Model (NCEP)',
  113: 'Products from NCEP SREF processing',
  114: 'NAEFS Products from joined NCEP, CMC global ensembles',
  115: 'Downscaled GFS from NAM eXtension',
  116: 'WRF-EM model, generic resolution (Used in various runs) EM - Eulerian Mass-core (NCAR - aka Advanced Research WRF)',
  117: 'NEMS GFS Aerosol Component',
  118: 'UnRestricted Mesoscale Analysis (URMA)',
  119: 'WAM (Whole Atmosphere Model)',
  120: 'Ice Concentration Analysis',
  121: 'Western North Atlantic Regional Wave Model',
  122: 'Alaska Waters Regional Wave Model',
  123: 'North Atlantic Hurricane Wave Model',
  124: 'Eastern North Pacific Regional Wave Model',
  125: 'North Pacific Hurricane Wave Model',
  126: 'Sea Ice Forecast Model',
  127: 'Lake Ice Forecast Model',
  128: 'Global Ocean Forecast Model',
  129: 'Global Ocean Data Analysis System (GODAS)',
  130: 'Merge of fields from the RUC, NAM, and Spectral Model',
  131: 'Great Lakes Wave Model',
  132: 'High Resolution Ensemble Forecast (HREF)',
  133: 'Great Lakes Short Range Wave Model',
  134: 'Rapid Refresh Forecast System (RRFS)',
  135: 'Hurricane Analysis and Forecast System (HAFS)',
  140: 'North American Regional Reanalysis (NARR)',
  141: 'Land Data Assimilation and Forecast System',
  150: 'NWS River Forecast System (NWSRFS)',
  151: 'NWS Flash Flood Guidance System (NWSFFGS)',
  152: 'WSR-88D Stage II Precipitation Analysis',
  153: 'WSR-88D Stage III Precipitation Analysis',
  180: 'Quantitative Precipitation Forecast generated by NCEP',
  181: 'River Forecast Center Quantitative Precipitation Forecast mosaic generated by NCEP',
  182: 'River Forecast Center Quantitative Precipitation estimate mosaic generated by NCEP',
  183: 'NDFD product generated by NCEP/HPC',
  184: 'Climatological Calibrated Precipitation Analysis (CCPA)',
  190: 'National Convective Weather Diagnostic generated by NCEP/AWC',
  191: 'Current Icing Potential automated product generated by NCEP/AWC',
  192: 'Analysis product from NCEP/AWC',
  193: 'Forecast product from NCEP/AWC',
  195: 'Climate Data Assimilation System 2 (CDAS2)',
  196: 'Climate Data Assimilation System 2 (CDAS2) - used for regeneration runs',
  197: 'Climate Data Assimilation System (CDAS)',
  198: 'Climate Data Assimilation System (CDAS) - used for regeneration runs',
  199: 'Climate Forecast System Reanalysis (CFSR) -- Atmospheric model (GFS) coupled to a multi level ocean, land and seaice model. GFS spectral model at T382, 64 levels coupled to 40 level MOM4 ocean model.',
  200: 'CPC Manual Forecast Product',
  201: 'CPC Automated Product',
  210: 'EPA Air Quality Forecast - Currently North East US domain',
  211: 'EPA Air Quality Forecast - Currently Eastern US domain',
  215: 'SPC Manual Forecast Product',
  220: 'NCEP/OPC automated product',
  255: 'Missing',
  // 202-209: Reserved
  // 212-214: Reserved
  // 216-219: Reserved
  // 221-230: Reserved for WPC products
  // 231-254: Reserved
};

/**
 * # ON388 - TABLE C - NATIONAL SUB-CENTERS (Assigned By The Nation)
 *
 * **Details**:
 * - **Originating Center**: 7 (US-NWS, NCEP)
 * - **GRIB1 - PDS Octet**: 26
 * - **GRIB2 - Section**: 1, Octets 8-9
 * - **Revised**: 02/23/2024
 *
 * **Reserved Ranges**:
 * - `0`: Reserved
 * - `19-254`: Reserved
 *
 * **Special Value**:
 * - `255`: Missing
 *
 * ## Description
 * This table defines the national sub-centers assigned by Originating Center 7 (US-NWS, NCEP) in GRIB1 and GRIB2 files,
 * specifying various generating processes or models.
 *
 * ## Notes
 * - Red text depicts changes made since 06/25/2019
 */
export const grib2LookupTableC: Record<number, string> = {
  // 0: Reserved
  1: 'NCEP Re-Analysis Project',
  2: 'NCEP Ensemble Products',
  3: 'NCEP Central Operations',
  4: 'Environmental Modeling Center',
  5: 'Weather Prediction Center',
  6: 'Ocean Prediction Center',
  7: 'Climate Prediction Center',
  8: 'Aviation Weather Center',
  9: 'Storm Prediction Center',
  10: 'National Hurricane Center',
  11: 'NWS Techniques Development Laboratory',
  12: 'NESDIS Office of Research and Applications',
  13: 'Federal Aviation Administration',
  14: 'NWS Meteorological Development Laboratory',
  15: 'North American Regional Reanalysis Project',
  16: 'Space Weather Prediction Center',
  17: 'ESRL Global Systems Division',
  18: 'National Water Center',
  // 19-254: Reserved
  255: 'Missing',
};

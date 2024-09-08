// import fetcher from './fetch';

import DataBaseFile from './dbf';
import FileReader from '../fileReader';
import Shapefile from './shp';
import { exists, readFile } from 'fs/promises';

// import proj4 from 'proj4';
// import unzip from './unzip';

export * from './dbf';
export * from './shp';

/**
 *
 */
export interface Definition {
  /** The path to the .shp file */
  shp: string;
  /** The path to the .dbf file. dbf is optional, but needed if you want attributes */
  dbf?: string;
  /**
   * The path to the .prj file. prj is optional, but needed if your file is in some
   * projection you don't want it in
   */
  prj?: string;
  /**
   * The path to the .cpg file. cpg is optional, but needed if your dbf is in some
   * weird (non utf8) encoding.
   */
  cpg?: string;
}

/**
 * Assumes the input is pointing to a shapefile or name without the extension.
 * The algorithm will find the rest of the paths if they exist.
 * @param input - the path to the .shp file or name without the extension
 * @returns - a Shapefile
 */
export async function fromPath(input: string) {
  const path = input.replace('.shp', '');
  const shp = `${path}.shp`;
  const dbf = `${path}.dbf`;
  const prj = `${path}.prj`;
  const cpg = `${path}.cpg`;
  if (!(await exists(shp))) throw new Error('Shapefile does not exist');
  const definition: Definition = {
    shp,
    dbf: (await exists(dbf)) ? dbf : undefined,
    prj: (await exists(prj)) ? prj : undefined,
    cpg: (await exists(cpg)) ? cpg : undefined,
  };
  return fromDefinition(definition);
}

/**
 * @param def
 */
export async function fromDefinition(def: Definition): Promise<Shapefile> {
  const { shp, dbf, cpg } = def; // TODO: prj
  const encoding = cpg ? await readFile(cpg, { encoding: 'utf8' }) : 'utf8';
  const dbfBuffer = dbf !== undefined ? new FileReader(dbf) : undefined;
  const databaseFile = dbfBuffer !== undefined ? new DataBaseFile(dbfBuffer, encoding) : undefined;
  // TODO: Projection
  const shpBuffer = new DataView((await readFile(shp)).buffer);
  return new Shapefile(shpBuffer, undefined, databaseFile);
}

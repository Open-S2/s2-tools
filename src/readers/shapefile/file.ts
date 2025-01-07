import { DataBaseFile } from './dbf';
import { FileReader } from '../file';
import { ShapeFileReader } from './shp';
import { Transformer } from '../../proj4';
import { shapefileFromGzip } from '.';
import { exists, readFile } from 'fs/promises';

import type { ProjectionTransformDefinition } from '../../proj4';

export * from './dbf';
export * from './shp';

/** A description of what relevant files exist and where */
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
 * The algorithm will find the rest of the paths if they exist. May also be a gzipped folder.
 * @param input - the path to the .shp file or name without the extension
 * @param defs - optional array of ProjectionTransformDefinitions to insert
 * @param epsgCodes - a record of EPSG codes to use for the transformer if needed
 * @returns - a Shapefile
 */
export async function shapefileFromPath(
  input: string,
  defs?: ProjectionTransformDefinition[],
  epsgCodes?: Record<string, string>,
): Promise<ShapeFileReader> {
  if (input.endsWith('.zip')) {
    const gzipData = await readFile(input);
    return shapefileFromGzip(gzipData.buffer);
  }
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

  return shapefileFromDefinition(definition, defs, epsgCodes);
}

/**
 * Build a Shapefile from a Definition
 * @param def - a description of the data to parse
 * @param defs - optional array of ProjectionTransformDefinitions to insert
 * @param epsgCodes - a record of EPSG codes to use for the transformer if needed
 * @returns - a Shapefile
 */
export async function shapefileFromDefinition(
  def: Definition,
  defs: ProjectionTransformDefinition[] = [],
  epsgCodes: Record<string, string> = {},
): Promise<ShapeFileReader> {
  const { shp, dbf, prj, cpg } = def;
  const encoding = cpg !== undefined ? await readFile(cpg, { encoding: 'utf8' }) : 'utf8';
  const transform =
    prj !== undefined ? new Transformer(await readFile(prj, { encoding: 'utf8' })) : undefined;
  const dbfReader = dbf !== undefined ? new FileReader(dbf) : undefined;
  const databaseFile = dbfReader !== undefined ? new DataBaseFile(dbfReader, encoding) : undefined;

  if (transform !== undefined) {
    for (const def of defs) transform.insertDefinition(def);
    for (const [key, value] of Object.entries(epsgCodes)) transform.insertEPSGCode(key, value);
  }

  return new ShapeFileReader(new FileReader(shp), databaseFile, transform);
}

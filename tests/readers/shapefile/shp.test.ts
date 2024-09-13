import { BufferReader } from '../../../src/readers';
import DataBaseFile from '../../../src/readers/shapefile/dbf';
import FileReader from '../../../src/readers/fileReader';
import MMapReader from '../../../src/readers/mmapReader';
import ShapeFile from '../../../src/readers/shapefile/shp';
import { expect, test } from 'bun:test';

import { readFile } from 'fs/promises';

test('utf shp', async () => {
  const data = new BufferReader((await readFile('tests/readers/fixtures/utf.shp')).buffer);
  const shp = new ShapeFile(data);

  expect(shp.getHeader()).toEqual({
    bbox: [-108.97956848144531, 41.244772343082076, -108.6328125, 41.253032440653186, 0, 0],
    length: 156,
    shpCode: 1,
    version: 1000,
  });

  const featureCollection = shp.getFeatureCollection();
  expect(featureCollection).toEqual({
    bbox: [-108.97956848144531, 41.244772343082076, -108.6328125, 41.253032440653186, 0, 0],
    features: [
      {
        geometry: {
          coordinates: { x: -108.6328125, y: 41.244772343082076 },
          is3D: false,
          type: 'Point',
        },
        id: 1,
        properties: {},
        type: 'VectorFeature',
      },
      {
        geometry: {
          coordinates: { x: -108.97956848144531, y: 41.253032440653186 },
          is3D: false,
          type: 'Point',
        },
        id: 2,
        properties: {},
        type: 'VectorFeature',
      },
    ],
    type: 'FeatureCollection',
  });
});

test('utf shp with dbf', async () => {
  const shpData = new BufferReader((await readFile('tests/readers/fixtures/utf.shp')).buffer);
  const dbfData = new BufferReader((await readFile('tests/readers/fixtures/utf.dbf')).buffer);
  const dbf = new DataBaseFile(dbfData, 'utf-8');
  const shp = new ShapeFile(shpData, dbf);

  expect(shp.getHeader()).toEqual({
    bbox: [-108.97956848144531, 41.244772343082076, -108.6328125, 41.253032440653186, 0, 0],
    length: 156,
    shpCode: 1,
    version: 1000,
  });

  const featureCollection = shp.getFeatureCollection();
  expect(featureCollection).toEqual({
    bbox: [-108.97956848144531, 41.244772343082076, -108.6328125, 41.253032440653186, 0, 0],
    features: [
      {
        geometry: {
          coordinates: { x: -108.6328125, y: 41.244772343082076 },
          is3D: false,
          type: 'Point',
        },
        id: 1,
        properties: { field: '💩' },
        type: 'VectorFeature',
      },
      {
        geometry: {
          coordinates: { x: -108.97956848144531, y: 41.253032440653186 },
          is3D: false,
          type: 'Point',
        },
        id: 2,
        properties: { field: 'Hněvošický háj' },
        type: 'VectorFeature',
      },
    ],
    type: 'FeatureCollection',
  });
});

test('utf shp - file', async () => {
  const data = new FileReader('tests/readers/fixtures/utf.shp');
  const shp = new ShapeFile(data);

  expect(shp.getHeader()).toEqual({
    bbox: [-108.97956848144531, 41.244772343082076, -108.6328125, 41.253032440653186, 0, 0],
    length: 156,
    shpCode: 1,
    version: 1000,
  });
  data.close();
});

test('multipointz shp', async () => {
  const data = new MMapReader('tests/readers/fixtures/export_multipointz.shp');
  const shp = new ShapeFile(data);

  expect(shp.getHeader()).toEqual({
    bbox: [-123, 46, -121, 48, 0, 0],
    length: 276,
    shpCode: 18,
    version: 1000,
  });

  const featureCollection = shp.getFeatureCollection();

  expect(featureCollection).toEqual({
    type: 'FeatureCollection',
    features: [
      {
        id: 0,
        type: 'VectorFeature',
        properties: {},
        geometry: {
          bbox: [-123, 46, -121, 48, 1200, 3600],
          coordinates: [
            { x: -123, y: 48, z: 1200 },
            { x: -122, y: 47, z: 2500 },
            { x: -121, y: 46, z: 3600 },
          ],
          is3D: true,
          type: 'MultiPoint',
        },
      },
    ],
    bbox: [-123, 46, -121, 48, 0, 0],
  });
});

test('polylinez shp', async () => {
  const data = new BufferReader(
    (await readFile('tests/readers/fixtures/export_polylinez.shp')).buffer,
  );
  const shp = new ShapeFile(data);

  expect(shp.getHeader()).toEqual({
    bbox: [-120, 38, -113, 45, 0, 0],
    length: 384,
    shpCode: 13,
    version: 1000,
  });

  const featureCollection = shp.getFeatureCollection();

  expect(featureCollection).toEqual({
    bbox: [-120, 38, -113, 45, 0, 0],
    features: [
      {
        geometry: {
          bbox: [-120, 38, -113, 45, 0, 2300],
          coordinates: [
            [
              { x: -120, y: 45, z: 800 },
              { x: -119, y: 44, z: 1100 },
              { x: -118, y: 43, z: 2300 },
            ],
            [
              { x: -115, y: 40, z: 0 },
              { x: -114, y: 39, z: 0 },
              { x: -113, y: 38, z: 0 },
            ],
          ],
          is3D: true,
          type: 'MultiLineString',
        },
        id: 1,
        properties: {},
        type: 'VectorFeature',
      },
    ],
    type: 'FeatureCollection',
  });
});
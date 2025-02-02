import { FileReader } from '../../../src/file';
import { MMapReader } from '../../../src/mmap';
import { BufferReader, DataBaseFile } from '../../../src';
import { expect, test } from 'bun:test';

test('empty dbf', async () => {
  const data = new BufferReader(await Bun.file(`${__dirname}/fixtures/empty.dbf`).arrayBuffer());
  const dbf = new DataBaseFile(data, 'utf-8');

  expect(dbf.getHeader()).toEqual({
    lastUpdated: new Date('2016-03-21T00:00:00.000Z'),
    records: 2,
    headerLen: 33,
    recLen: 1,
  });
  expect(dbf.getProperties(0)).toEqual({});
  expect(dbf.getProperties(1)).toEqual({});
});

test('codepage dbf', async () => {
  const data = new BufferReader(await Bun.file(`${__dirname}/fixtures/codepage.dbf`).arrayBuffer());
  const dbf = new DataBaseFile(data, 'utf-8');

  expect(dbf.getHeader()).toEqual({
    lastUpdated: new Date('1995-08-26T00:00:00.000Z'),
    records: 2,
    headerLen: 65,
    recLen: 255,
  });
  expect(dbf.getProperties(0)).toEqual({ field: '??' });
  expect(dbf.getProperties(1)).toEqual({ field: 'Hn�vo�ick� h�j' });
});

test('utf dbf', async () => {
  const data = new BufferReader(await Bun.file(`${__dirname}/fixtures/utf.dbf`).arrayBuffer());
  const dbf = new DataBaseFile(data, 'utf-8');

  expect(dbf.getHeader()).toEqual({
    lastUpdated: new Date('1995-08-26T00:00:00.000Z'),
    records: 2,
    headerLen: 65,
    recLen: 255,
  });
  expect(dbf.getProperties(0)).toEqual({ field: '💩' });
  expect(dbf.getProperties(1)).toEqual({ field: 'Hněvošický háj' });
});

test('watershed dbf', () => {
  const data = new MMapReader(`${__dirname}/fixtures/watershed.dbf`);
  const dbf = new DataBaseFile(data, 'utf-8');

  expect(dbf.getHeader()).toEqual({
    lastUpdated: new Date('2013-10-20T00:00:00.000Z'),
    records: 33,
    headerLen: 193,
    recLen: 104,
  });

  expect(dbf.getAllProperties()).toEqual([
    {
      DWM_NAME: 'BUZZARDS BAY',
      DWM_CODE: '95',
      DRAINAGE: 'coastal',
      SHAPE_AREA: 1100426424.93,
      SHAPE_LEN: 680071.913919,
    },
    {
      DWM_NAME: 'CAPE COD',
      DWM_CODE: '96',
      DRAINAGE: 'coastal',
      SHAPE_AREA: 913978642.943,
      SHAPE_LEN: 802211.67478,
    },
    {
      DWM_NAME: 'MERRIMACK',
      DWM_CODE: '84',
      DRAINAGE: 'river and coastal',
      SHAPE_AREA: 728159472.653,
      SHAPE_LEN: 330783.925198,
    },
    {
      DWM_NAME: 'DEERFIELD',
      DWM_CODE: '33',
      DRAINAGE: 'river',
      SHAPE_AREA: 897643472.911,
      SHAPE_LEN: 162416.647504,
    },
    {
      DWM_NAME: 'CONNECTICUT',
      DWM_CODE: '34',
      DRAINAGE: 'river',
      SHAPE_AREA: 1733946880.89,
      SHAPE_LEN: 418239.123507,
    },
    {
      DWM_NAME: 'NASHUA',
      DWM_CODE: '81',
      DRAINAGE: 'river',
      SHAPE_AREA: 1154375570.89,
      SHAPE_LEN: 220748.885051,
    },
    {
      DWM_NAME: 'SHAWSHEEN',
      DWM_CODE: '83',
      DRAINAGE: 'river',
      SHAPE_AREA: 202238731.243,
      SHAPE_LEN: 124382.780229,
    },
    {
      DWM_NAME: 'IPSWICH',
      DWM_CODE: '92',
      DRAINAGE: 'river and coastal',
      SHAPE_AREA: 402321528.158,
      SHAPE_LEN: 194368.060063,
    },
    {
      DWM_NAME: 'CONCORD (SuAsCo)',
      DWM_CODE: '82',
      DRAINAGE: 'river',
      SHAPE_AREA: 1034986406.42,
      SHAPE_LEN: 207648.657121,
    },
    {
      DWM_NAME: 'WESTFIELD',
      DWM_CODE: '32',
      DRAINAGE: 'river',
      SHAPE_AREA: 1337870479.81,
      SHAPE_LEN: 309269.019544,
    },
    {
      DWM_NAME: 'HOUSATONIC',
      DWM_CODE: '21',
      DRAINAGE: 'river',
      SHAPE_AREA: 1295634364.97,
      SHAPE_LEN: 254658.861254,
    },
    {
      DWM_NAME: 'CHARLES',
      DWM_CODE: '72',
      DRAINAGE: 'river and coastal',
      SHAPE_AREA: 804337278.228,
      SHAPE_LEN: 249234.107364,
    },
    {
      DWM_NAME: 'BLACKSTONE',
      DWM_CODE: '51',
      DRAINAGE: 'river',
      SHAPE_AREA: 868716081.064,
      SHAPE_LEN: 247406.544661,
    },
    {
      DWM_NAME: 'FARMINGTON',
      DWM_CODE: '31',
      DRAINAGE: 'river',
      SHAPE_AREA: 403208864.827,
      SHAPE_LEN: 174077.861519,
    },
    {
      DWM_NAME: 'FRENCH',
      DWM_CODE: '42',
      DRAINAGE: 'river',
      SHAPE_AREA: 245240661.27,
      SHAPE_LEN: 95630.237872,
    },
    {
      DWM_NAME: 'SOUTH COASTAL',
      DWM_CODE: '94',
      DRAINAGE: 'coastal',
      SHAPE_AREA: 623318341.503,
      SHAPE_LEN: 348638.121478,
    },
    {
      DWM_NAME: 'QUINEBAUG',
      DWM_CODE: '41',
      DRAINAGE: 'river',
      SHAPE_AREA: 398412533.969,
      SHAPE_LEN: 155488.644205,
    },
    {
      DWM_NAME: 'TAUNTON',
      DWM_CODE: '62',
      DRAINAGE: 'river',
      SHAPE_AREA: 1371098117.82,
      SHAPE_LEN: 339730.645372,
    },
    {
      DWM_NAME: 'TEN MILE',
      DWM_CODE: '52',
      DRAINAGE: 'river',
      SHAPE_AREA: 125924435.756,
      SHAPE_LEN: 84146.6302256,
    },
    {
      DWM_NAME: 'NARRAGANSETT BAY (SHORE)',
      DWM_CODE: '53',
      DRAINAGE: 'coastal',
      SHAPE_AREA: 150006557.671,
      SHAPE_LEN: 63312.1134996,
    },
    {
      DWM_NAME: 'ISLANDS',
      DWM_CODE: '97',
      DRAINAGE: 'coastal',
      SHAPE_AREA: 412340033.574,
      SHAPE_LEN: 443601.354619,
    },
    {
      DWM_NAME: 'CHICOPEE',
      DWM_CODE: '36',
      DRAINAGE: 'river',
      SHAPE_AREA: 1868726700.74,
      SHAPE_LEN: 336390.398831,
    },
    {
      DWM_NAME: 'MILLERS',
      DWM_CODE: '35',
      DRAINAGE: 'river',
      SHAPE_AREA: 805953097.126,
      SHAPE_LEN: 208548.57714,
    },
    {
      DWM_NAME: 'BOSTON HARBOR: Mystic',
      DWM_CODE: '71',
      DRAINAGE: 'river and coastal',
      SHAPE_AREA: 169490600.488,
      SHAPE_LEN: 104702.983458,
    },
    {
      DWM_NAME: 'BOSTON HARBOR: Weymouth & Weir',
      DWM_CODE: '74',
      DRAINAGE: 'river and coastal',
      SHAPE_AREA: 230274616.059,
      SHAPE_LEN: 205749.368678,
    },
    {
      DWM_NAME: 'BOSTON HARBOR: Neponset',
      DWM_CODE: '73',
      DRAINAGE: 'river and coastal',
      SHAPE_AREA: 302273378.57,
      SHAPE_LEN: 164291.649994,
    },
    {
      DWM_NAME: 'NORTH COASTAL',
      DWM_CODE: '93',
      DRAINAGE: 'coastal',
      SHAPE_AREA: 444012782.854,
      SHAPE_LEN: 481586.96927,
    },
    {
      DWM_NAME: 'PARKER',
      DWM_CODE: '91',
      DRAINAGE: 'river and coastal',
      SHAPE_AREA: 210671196.057,
      SHAPE_LEN: 223674.642474,
    },
    {
      DWM_NAME: 'BOSTON HARBOR (Proper)',
      DWM_CODE: '70',
      DRAINAGE: 'coastal',
      SHAPE_AREA: 58322330.1896,
      SHAPE_LEN: 192742.092623,
    },
    {
      DWM_NAME: 'MOUNT HOPE BAY (SHORE)',
      DWM_CODE: '61',
      DRAINAGE: 'coastal',
      SHAPE_AREA: 140721349.355,
      SHAPE_LEN: 130978.457315,
    },
    {
      DWM_NAME: 'HUDSON: Bashbish',
      DWM_CODE: '13',
      DRAINAGE: 'river',
      SHAPE_AREA: 39802182.4217,
      SHAPE_LEN: 41431.5176318,
    },
    {
      DWM_NAME: 'HUDSON: Hoosic',
      DWM_CODE: '11',
      DRAINAGE: 'river',
      SHAPE_AREA: 430987849.282,
      SHAPE_LEN: 108535.221012,
    },
    {
      DWM_NAME: 'HUDSON: Kinderhook',
      DWM_CODE: '12',
      DRAINAGE: 'river',
      SHAPE_AREA: 56596528.9263,
      SHAPE_LEN: 55533.0776528,
    },
  ]);
});

test('watershed-specialCharacters dbf', () => {
  const data = new FileReader(`${__dirname}/fixtures/watershed-specialCharacters.dbf`);
  const dbf = new DataBaseFile(data, 'utf-8');

  expect(dbf.getHeader()).toEqual({
    lastUpdated: new Date('2013-10-20T00:00:00.000Z'),
    records: 33,
    headerLen: 193,
    recLen: 104,
  });
  expect(dbf.getAllProperties()).toEqual([
    {
      DWM_NAME: 'BUZZARDS BAY',
      DWM_CODE: '95',
      'TEST."-:!': 'coastal',
      SHAPE_AREA: 1100426424.93,
      SHAPE_LEN: 680071.913919,
    },
    {
      DWM_NAME: 'CAPE COD',
      DWM_CODE: '96',
      'TEST."-:!': 'coastal',
      SHAPE_AREA: 913978642.943,
      SHAPE_LEN: 802211.67478,
    },
    {
      DWM_NAME: 'MERRIMACK',
      DWM_CODE: '84',
      'TEST."-:!': 'river and coastal',
      SHAPE_AREA: 728159472.653,
      SHAPE_LEN: 330783.925198,
    },
    {
      DWM_NAME: 'DEERFIELD',
      DWM_CODE: '33',
      'TEST."-:!': 'river',
      SHAPE_AREA: 897643472.911,
      SHAPE_LEN: 162416.647504,
    },
    {
      DWM_NAME: 'CONNECTICUT',
      DWM_CODE: '34',
      'TEST."-:!': 'river',
      SHAPE_AREA: 1733946880.89,
      SHAPE_LEN: 418239.123507,
    },
    {
      DWM_NAME: 'NASHUA',
      DWM_CODE: '81',
      'TEST."-:!': 'river',
      SHAPE_AREA: 1154375570.89,
      SHAPE_LEN: 220748.885051,
    },
    {
      DWM_NAME: 'SHAWSHEEN',
      DWM_CODE: '83',
      'TEST."-:!': 'river',
      SHAPE_AREA: 202238731.243,
      SHAPE_LEN: 124382.780229,
    },
    {
      DWM_NAME: 'IPSWICH',
      DWM_CODE: '92',
      'TEST."-:!': 'river and coastal',
      SHAPE_AREA: 402321528.158,
      SHAPE_LEN: 194368.060063,
    },
    {
      DWM_NAME: 'CONCORD (SuAsCo)',
      DWM_CODE: '82',
      'TEST."-:!': 'river',
      SHAPE_AREA: 1034986406.42,
      SHAPE_LEN: 207648.657121,
    },
    {
      DWM_NAME: 'WESTFIELD',
      DWM_CODE: '32',
      'TEST."-:!': 'river',
      SHAPE_AREA: 1337870479.81,
      SHAPE_LEN: 309269.019544,
    },
    {
      DWM_NAME: 'HOUSATONIC',
      DWM_CODE: '21',
      'TEST."-:!': 'river',
      SHAPE_AREA: 1295634364.97,
      SHAPE_LEN: 254658.861254,
    },
    {
      DWM_NAME: 'CHARLES',
      DWM_CODE: '72',
      'TEST."-:!': 'river and coastal',
      SHAPE_AREA: 804337278.228,
      SHAPE_LEN: 249234.107364,
    },
    {
      DWM_NAME: 'BLACKSTONE',
      DWM_CODE: '51',
      'TEST."-:!': 'river',
      SHAPE_AREA: 868716081.064,
      SHAPE_LEN: 247406.544661,
    },
    {
      DWM_NAME: 'FARMINGTON',
      DWM_CODE: '31',
      'TEST."-:!': 'river',
      SHAPE_AREA: 403208864.827,
      SHAPE_LEN: 174077.861519,
    },
    {
      DWM_NAME: 'FRENCH',
      DWM_CODE: '42',
      'TEST."-:!': 'river',
      SHAPE_AREA: 245240661.27,
      SHAPE_LEN: 95630.237872,
    },
    {
      DWM_NAME: 'SOUTH COASTAL',
      DWM_CODE: '94',
      'TEST."-:!': 'coastal',
      SHAPE_AREA: 623318341.503,
      SHAPE_LEN: 348638.121478,
    },
    {
      DWM_NAME: 'QUINEBAUG',
      DWM_CODE: '41',
      'TEST."-:!': 'river',
      SHAPE_AREA: 398412533.969,
      SHAPE_LEN: 155488.644205,
    },
    {
      DWM_NAME: 'TAUNTON',
      DWM_CODE: '62',
      'TEST."-:!': 'river',
      SHAPE_AREA: 1371098117.82,
      SHAPE_LEN: 339730.645372,
    },
    {
      DWM_NAME: 'TEN MILE',
      DWM_CODE: '52',
      'TEST."-:!': 'river',
      SHAPE_AREA: 125924435.756,
      SHAPE_LEN: 84146.6302256,
    },
    {
      DWM_NAME: 'NARRAGANSETT BAY (SHORE)',
      DWM_CODE: '53',
      'TEST."-:!': 'coastal',
      SHAPE_AREA: 150006557.671,
      SHAPE_LEN: 63312.1134996,
    },
    {
      DWM_NAME: 'ISLANDS',
      DWM_CODE: '97',
      'TEST."-:!': 'coastal',
      SHAPE_AREA: 412340033.574,
      SHAPE_LEN: 443601.354619,
    },
    {
      DWM_NAME: 'CHICOPEE',
      DWM_CODE: '36',
      'TEST."-:!': 'river',
      SHAPE_AREA: 1868726700.74,
      SHAPE_LEN: 336390.398831,
    },
    {
      DWM_NAME: 'MILLERS',
      DWM_CODE: '35',
      'TEST."-:!': 'river',
      SHAPE_AREA: 805953097.126,
      SHAPE_LEN: 208548.57714,
    },
    {
      DWM_NAME: 'BOSTON HARBOR: Mystic',
      DWM_CODE: '71',
      'TEST."-:!': 'river and coastal',
      SHAPE_AREA: 169490600.488,
      SHAPE_LEN: 104702.983458,
    },
    {
      DWM_NAME: 'BOSTON HARBOR: Weymouth & Weir',
      DWM_CODE: '74',
      'TEST."-:!': 'river and coastal',
      SHAPE_AREA: 230274616.059,
      SHAPE_LEN: 205749.368678,
    },
    {
      DWM_NAME: 'BOSTON HARBOR: Neponset',
      DWM_CODE: '73',
      'TEST."-:!': 'river and coastal',
      SHAPE_AREA: 302273378.57,
      SHAPE_LEN: 164291.649994,
    },
    {
      DWM_NAME: 'NORTH COASTAL',
      DWM_CODE: '93',
      'TEST."-:!': 'coastal',
      SHAPE_AREA: 444012782.854,
      SHAPE_LEN: 481586.96927,
    },
    {
      DWM_NAME: 'PARKER',
      DWM_CODE: '91',
      'TEST."-:!': 'river and coastal',
      SHAPE_AREA: 210671196.057,
      SHAPE_LEN: 223674.642474,
    },
    {
      DWM_NAME: 'BOSTON HARBOR (Proper)',
      DWM_CODE: '70',
      'TEST."-:!': 'coastal',
      SHAPE_AREA: 58322330.1896,
      SHAPE_LEN: 192742.092623,
    },
    {
      DWM_NAME: 'MOUNT HOPE BAY (SHORE)',
      DWM_CODE: '61',
      'TEST."-:!': 'coastal',
      SHAPE_AREA: 140721349.355,
      SHAPE_LEN: 130978.457315,
    },
    {
      DWM_NAME: 'HUDSON: Bashbish',
      DWM_CODE: '13',
      'TEST."-:!': 'river',
      SHAPE_AREA: 39802182.4217,
      SHAPE_LEN: 41431.5176318,
    },
    {
      DWM_NAME: 'HUDSON: Hoosic',
      DWM_CODE: '11',
      'TEST."-:!': 'river',
      SHAPE_AREA: 430987849.282,
      SHAPE_LEN: 108535.221012,
    },
    {
      DWM_NAME: 'HUDSON: Kinderhook',
      DWM_CODE: '12',
      'TEST."-:!': 'river',
      SHAPE_AREA: 56596528.9263,
      SHAPE_LEN: 55533.0776528,
    },
  ]);

  data.close();
});

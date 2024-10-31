import { initl } from '../../../src/space';
import { expect, test } from 'bun:test';

import type { OperationMode } from '../../../src';

test('Legacy Sidereal Time Calculations', () => {
  const options = {
    ecco: 0.1846988,
    epoch: 25938.538312919904,
    inclo: 0,
    method: 'n',
    no: 0.0037028783237264057,
    opsmode: 'a' as OperationMode,
    satn: '00001',
  };
  const results = initl(options);
  expect(results.ainv).toBeCloseTo(0.1353414893496189, 6);
  expect(results.ao).toBeCloseTo(7.3887172721793, 5);
  expect(results.con41).toEqual(2);
  expect(results.con42).toEqual(-4);
  expect(results.cosio).toEqual(1);
  expect(results.cosio2).toEqual(1);
  expect(results.eccsq).toBeCloseTo(0.034113646721439995, 6);
  expect(results.gsto).toBeCloseTo(5.220883431398299, 6);
  expect(results.method).toEqual('n');
  expect(results.no).toBeCloseTo(0.003702762286531528, 6);
  expect(results.omeosq).toBeCloseTo(0.96588635327856, 6);
  expect(results.posq).toBeCloseTo(50.931932818552305, 3);
  expect(results.rp).toBeCloseTo(6.02403005846851, 5);
  expect(results.rteosq).toBeCloseTo(0.9827951736137902, 6);
  expect(results.sinio).toEqual(0);
});

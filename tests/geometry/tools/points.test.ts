import { averageOfPoints, centerOfPoints } from '../../../src/geometry/tools/points';
import { expect, test } from 'bun:test';

test('averageOfPoints', () => {
  expect(
    averageOfPoints([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]),
  ).toEqual({ x: 0.5, y: 0.5 });
  expect(
    averageOfPoints([
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
    ]),
  ).toEqual({ x: 0.5, y: 0.5, z: 0.5 });
  expect(averageOfPoints([])).toEqual({ x: 0, y: 0 });
  expect(
    averageOfPoints([
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1 },
    ]),
  ).toEqual({ x: 0.5, y: 0.5, z: 0 });
  expect(
    averageOfPoints([
      { x: 0, y: 0 },
      { x: 1, y: 1, z: 1 },
    ]),
  ).toEqual({ x: 0.5, y: 0.5, z: 0.5 });
});

test('centerOfPoints', () => {
  expect(
    centerOfPoints([
      { x: 0, y: 0 },
      { x: 1, y: 1 },
    ]),
  ).toEqual({ x: 0.5, y: 0.5 });
  expect(centerOfPoints([{ x: 0, y: 0, z: 0 }])).toEqual({ x: 0, y: 0, z: 0 });
  expect(
    centerOfPoints([
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1, z: 1 },
    ]),
  ).toEqual({ x: 0.5, y: 0.5, z: 0.5 });
  expect(
    centerOfPoints([
      { x: 0, y: 0 },
      { x: 1, y: 1, z: 1 },
    ]),
  ).toEqual({ x: 0.5, y: 0.5, z: 1 });
  expect(
    centerOfPoints([
      { x: 0, y: 0, z: 0 },
      { x: 1, y: 1 },
    ]),
  ).toEqual({ x: 0.5, y: 0.5, z: 0 });
  expect(centerOfPoints([{ x: 0, y: 0 }])).toEqual({ x: 0, y: 0 });
});

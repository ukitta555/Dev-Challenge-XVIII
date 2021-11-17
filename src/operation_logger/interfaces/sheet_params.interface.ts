import { PointCoordinate } from './point_coordinate.enum';

export enum Side {
  LENGTH,
  WIDTH,
  ZERO_COORD,
}

export interface SheetParams {
  sheetWidth: number;
  sheetLength: number;
  mode: Side;
  checkCoordinate: PointCoordinate;
}

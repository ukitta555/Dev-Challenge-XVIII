import { Point } from '../../box_cutter/interfaces/point.interface';
import { PointCoordinate } from './point_coordinate.enum';

export interface LogToParams {
  point: Point;
  coordinate: PointCoordinate;
  delta: number;
}

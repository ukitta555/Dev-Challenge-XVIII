import { Injectable, Scope } from '@nestjs/common';
import { PointCoordinate } from './interfaces/point_coordinate.enum';
import { LogToParams } from './interfaces/log_to_params.interface';
import { SheetParams, Side } from './interfaces/sheet_params.interface';

export type Log = {
  command: string;
  x?: number;
  y?: number;
};

@Injectable({ scope: Scope.REQUEST })
export class OperationExecutorService {
  private readonly logs: Log[];

  constructor() {
    this.logs = [];
  }

  private log(logString: Log) {
    this.logs.push(logString);
  }

  public getLogs(): Log[] {
    return this.logs;
  }

  public goTo(params: LogToParams): void {
    const { coordinate, delta, point } = params;
    if (coordinate === PointCoordinate.X) {
      point.x += delta;
    } else {
      point.y += delta;
    }
    this.log({
      command: 'GOTO',
      x: point.x,
      y: point.y,
    });
  }

  public down(): void {
    this.log({ command: 'DOWN' });
  }

  public up(): void {
    this.log({ command: 'UP' });
  }

  public start(): void {
    this.log({ command: 'START' });
  }

  public stop(): void {
    this.log({ command: 'STOP' });
  }

  public checkBordersAndGoTo(
    logToParams: LogToParams,
    sheetParams: SheetParams,
  ) {
    const { point, coordinate } = logToParams;
    const { sheetLength, sheetWidth, mode, checkCoordinate } = sheetParams;

    let requestedSideSize = 0;

    switch (mode) {
      case Side.WIDTH:
        requestedSideSize = sheetWidth;
        break;
      case Side.LENGTH:
        requestedSideSize = sheetLength;
        break;
      case Side.ZERO_COORD:
        requestedSideSize = 0;
        break;
    }
    const requestedCoordinate =
      checkCoordinate === PointCoordinate.Y ? point.y : point.x;

    if (requestedCoordinate === requestedSideSize) {
      this.up();
      this.goTo(logToParams);
      this.down();
    } else {
      this.goTo(logToParams);
    }
  }
}

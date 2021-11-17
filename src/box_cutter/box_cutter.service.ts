/*
 * ------>  BOX CUTTING'S LENGTH
 * |  *
 * | ***
 * |  *
 * |  *
 * V
 * BOX CUTTING'S WIDTH
 *
 */

import { Injectable, Logger, Scope } from '@nestjs/common';
import {
  BoxCutterRequestDTO,
  BoxSize,
  SheetSize,
} from '../interfaces/request.dto';
import {
  Log,
  OperationExecutorService,
} from '../operation_logger/operation_executor.service';
import { CutterMode } from './interfaces/cutter_mode.enum';
import { Point } from './interfaces/point.interface';
import { PointCoordinate } from '../operation_logger/interfaces/point_coordinate.enum';
import { Side } from '../operation_logger/interfaces/sheet_params.interface';
import { permutations } from './utils';

@Injectable({ scope: Scope.REQUEST })
export class BoxCutterService {
  constructor(private readonly operationExecutor: OperationExecutorService) {}
  private readonly logger = new Logger();

  public cutBoxes(request: BoxCutterRequestDTO) {
    const boxSizes: number[] = [...Object.values(request.boxSize)];
    const sheetSizes: number[] = [request.sheetSize.l, request.sheetSize.w];
    const [sheetLength, sheetWidth] = sheetSizes;
    const sheetMax = Math.max(...sheetSizes);
    const sheetMin = Math.min(...sheetSizes);
    const configurationPermutations: number[][] = permutations(boxSizes);
    let logs: Log[] = [];

    // for each possible box cutting configuration (6 possible)
    for (const configuration of configurationPermutations) {
      const [h, w, d] = configuration;
      // calculate width/height of cross, which is box's cutting
      const crossWidth = 2 * h + 2 * w;
      const crossLength = 2 * h + d;
      const crossMax = Math.max(crossLength, crossWidth);
      const crossMin = Math.min(crossLength, crossWidth);

      // check if box will fit inside the sheet
      if (crossMax > sheetMax || crossMin > sheetMin) {
        /*
        this.logger.debug(
          `Configuration h:${h} w:${w} d:${d} failed, trying another one`,
        );
         */
        continue;
      }

      /*
       we know it fits now, now we have to decide whether we want
       to rotate the box
      */

      /*
        Horizontal config = view picture in task pdf
        Vertical config = view ASCII art at the top of the file
       */
      if (
        this.isHorizontalConfigOK(
          crossLength,
          crossWidth,
          sheetLength,
          sheetWidth,
        )
      ) {
        logs = this.carveBox(
          { h, w, d },
          { l: sheetLength, w: sheetWidth },
          CutterMode.HORIZONTAL,
        );
        /*
        this.logger.debug(
          `Configuration h:${h} w:${w} d:${d} succeeded in horizontal mode!`,
        );
        */
        break;
      } else {
        logs = this.carveBox(
          { h, w, d },
          { l: sheetLength, w: sheetWidth },
          CutterMode.VERTICAL,
        );
        /*
        this.logger.debug(
          `Configuration h:${h} w:${w} d:${d} succeeded in vertical mode!`,
        );
        */
        break;
      }
    }

    if (logs.length) {
      return {
        success: true,
        amount: 1,
        program: logs,
      };
    } else {
      return {
        success: false,
        error: 'Invalid sheet size. Too small for producing at least one box',
      };
    }
  }

  private carveBox(
    boxConfiguration: BoxSize,
    sheetConfiguration: SheetSize,
    mode: CutterMode,
  ): Log[] {
    const { h, w, d } = boxConfiguration;
    const [sheetLength, sheetWidth] = [
      sheetConfiguration.l,
      sheetConfiguration.w,
    ];

    const currentPoint: Point = { x: 0, y: 0 };
    let logs: Log[];
    this.operationExecutor.start();
    switch (mode) {
      case CutterMode.HORIZONTAL: {
        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.X,
          delta: h,
        });
        this.operationExecutor.down();
        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.Y,
          delta: h,
        });
        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.X,
          delta: -h,
        });
        this.operationExecutor.up();
        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.Y,
          delta: d,
        });
        this.operationExecutor.down();
        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.X,
          delta: h,
        });
        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.Y,
          delta: h,
        });
        this.operationExecutor.checkBordersAndGoTo(
          { point: currentPoint, coordinate: PointCoordinate.X, delta: w },
          {
            sheetLength,
            sheetWidth,
            mode: Side.LENGTH,
            checkCoordinate: PointCoordinate.Y,
          },
        );

        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.Y,
          delta: -h,
        });
        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.X,
          delta: h + w,
        });

        this.operationExecutor.checkBordersAndGoTo(
          { point: currentPoint, coordinate: PointCoordinate.Y, delta: -d },
          {
            sheetLength,
            sheetWidth,
            mode: Side.WIDTH,
            checkCoordinate: PointCoordinate.X,
          },
        );

        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.X,
          delta: -(h + w),
        });
        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.Y,
          delta: -h,
        });

        this.operationExecutor.stop();

        logs = this.operationExecutor.getLogs();

        break;
      }
      case CutterMode.VERTICAL: {
        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.Y,
          delta: 2 * w + h,
        });

        this.operationExecutor.down();

        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.X,
          delta: h,
        });

        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.Y,
          delta: h,
        });

        this.operationExecutor.checkBordersAndGoTo(
          { point: currentPoint, coordinate: PointCoordinate.X, delta: d },
          {
            sheetLength,
            sheetWidth,
            mode: Side.LENGTH,
            checkCoordinate: PointCoordinate.Y,
          },
        );

        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.Y,
          delta: -h,
        });

        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.X,
          delta: h,
        });

        this.operationExecutor.checkBordersAndGoTo(
          { point: currentPoint, coordinate: PointCoordinate.Y, delta: -w },
          {
            sheetLength,
            sheetWidth,
            mode: Side.WIDTH,
            checkCoordinate: PointCoordinate.X,
          },
        );

        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.X,
          delta: -h,
        });

        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.Y,
          delta: -(h + w),
        });

        this.operationExecutor.checkBordersAndGoTo(
          { point: currentPoint, coordinate: PointCoordinate.X, delta: -d },
          {
            sheetLength,
            sheetWidth,
            mode: Side.ZERO_COORD,
            checkCoordinate: PointCoordinate.Y,
          },
        );

        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.Y,
          delta: h + w,
        });

        this.operationExecutor.goTo({
          point: currentPoint,
          coordinate: PointCoordinate.X,
          delta: -h,
        });

        this.operationExecutor.stop();

        logs = this.operationExecutor.getLogs();

        break;
      }
    }
    return logs;
  }

  private isHorizontalConfigOK(
    crossLength: number,
    crossWidth: number,
    sheetLength: number,
    sheetWidth: number,
  ) {
    return crossLength <= sheetLength && crossWidth <= sheetWidth;
  }
}

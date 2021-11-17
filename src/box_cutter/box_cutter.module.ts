import { Module } from '@nestjs/common';
import { BoxCutterService } from './box_cutter.service';
import { OperationExecutorModule } from '../operation_logger/operation_executor.module';

@Module({
  imports: [OperationExecutorModule],
  providers: [BoxCutterService],
  exports: [BoxCutterService],
})
export class BoxCutterModule {}
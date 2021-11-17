import { Module } from '@nestjs/common';
import { OperationExecutorService } from './operation_executor.service';

@Module({
  providers: [OperationExecutorService],
  exports: [OperationExecutorService],
})
export class OperationExecutorModule {}
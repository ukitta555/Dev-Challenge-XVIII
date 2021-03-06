import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { BoxCutterModule } from './box_cutter/box_cutter.module';

@Module({
  imports: [BoxCutterModule],
  controllers: [ApiController],
  providers: [],
})
export class AppModule {}

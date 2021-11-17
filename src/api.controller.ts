import { Body, Controller, Post, Res, ValidationPipe } from '@nestjs/common';
import { BoxCutterService } from './box_cutter/box_cutter.service';
import { BoxCutterRequestDTO } from './interfaces/request.dto';
import { Response } from 'express';
import { pipeOptions } from './box_cutter/utils';

@Controller()
export class ApiController {
  constructor(private readonly boxCutterService: BoxCutterService) {}

  @Post('/api/simple_box')
  getHello(
    @Body(new ValidationPipe(pipeOptions))
    request: BoxCutterRequestDTO,
    @Res()
    response: Response,
  ) {
    console.log(request);
    const result = this.boxCutterService.cutBoxes(request);
    if (result.success) {
      response.status(200);
    } else {
      response.status(422);
    }
    response.json(result);
  }
}

import { IsDefined, IsInt, IsPositive, ValidateNested } from 'class-validator';
import { plainToClass, Transform, Type } from 'class-transformer';

export class SheetSize {
  @IsPositive()
  @IsDefined()
  w: number;

  @IsPositive()
  @IsDefined()
  l: number;
}

export class BoxSize {
  @IsDefined()
  @IsInt()
  @IsPositive()
  w: number;

  @IsDefined()
  @IsInt()
  @IsPositive()
  d: number;

  @IsDefined()
  @IsInt()
  @IsPositive()
  h: number;
}

export class BoxCutterRequestDTO {
  @IsDefined()
  @ValidateNested()
  @Type(() => SheetSize)
  sheetSize: SheetSize;

  @IsDefined()
  @Type(() => BoxSize)
  @ValidateNested()
  boxSize: BoxSize;
}

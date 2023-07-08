import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsBoolean, IsNumber, IsOptional } from "class-validator";

export class subscribeFilterDto {

  @Transform(({value}) => parseInt(value)) 
  @ApiProperty({example: 1, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  @IsOptional() // для валидации обязательность
  id: number;

  @Transform(({value}) => parseInt(value)) 
  @ApiProperty({example: 1, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  @IsOptional() // для валидации обязательность
  client_id: number;

  @ApiProperty({example: true, required: false}) // для сваггера
  @IsBoolean()
  @IsOptional()
  sms_send: Boolean;

  @ApiProperty({example: true, required: false}) // для сваггера
  @IsBoolean()
  @IsOptional()  
  email_send: Boolean;

  @Transform(({value}) => parseInt(value)) 
  @ApiProperty({example: 20, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  @IsOptional() // для валидации обязательность
  take: number;

  @Transform(({value}) => parseInt(value)) 
  @ApiProperty({example: 20, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  @IsOptional() // для валидации обязательность
  skip: number;

}
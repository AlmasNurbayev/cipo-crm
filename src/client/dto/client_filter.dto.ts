import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsArray, IsNumber, IsOptional, IsString } from "class-validator";

export class ClientFilterDto {

  @Transform(({value}) => parseInt(value)) 
  @ApiProperty({example: 1, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  @IsOptional() // для валидации обязательность
  id: number;

  @ApiProperty({example: 'abc@abc.kz', required: false})
  @IsString()
  @IsOptional()
  email: string;

  @ApiProperty({example: '+7 701 777 7777', required: false})
  @IsString()
  @IsOptional()
  phone: string;

  @ApiProperty({example: 'Ivan Petrov'})
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({example: 'Astana', required: false})
  @IsString()
  @IsOptional()
  city: string;

  @ApiProperty({example: 'Алматинский район', required: false})
  @IsString()
  @IsOptional()
  district: string;

  @ApiProperty({example: 'любая поисковая строка', required: false})
  @IsString()
  @IsOptional()
  search: string;

  @ApiProperty({example: 'массив условий поиска ИЛИ', required: false})
  @IsArray()
  @IsOptional()
  OR: any;

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
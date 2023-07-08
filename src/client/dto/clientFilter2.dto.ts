import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, ValidateNested, isArray, isBoolean } from "class-validator";


class filter {
  @ApiProperty({example: 'email', required: true})
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({example: 'abc@mail.ru', required: true})
  @IsString()
  @IsOptional()
  value: string;
}

class sorting {
  @ApiProperty({example: 'email', required: true})
  @IsString()
  @IsOptional()
  id: string;

  @ApiProperty({example: 'true', required: true})
  @IsBoolean()
  @IsOptional()
  desc: boolean;
}

export class ClientFilter2Dto {

  // samples of query
  //  filters: [{"id":"lastName","value":"ntldr"},{"id":"firstName","value":"1"}]
  //  sorting: [{"id":"lastName","desc":false}]
  //  globalFilter: ntldr
  //  start: 20
  //  size: 10

  //@Transform(({value}) => Array(value))
  @IsArray()
  @ApiProperty({ description: 'Array of search keys', isArray: true, type: [filter], example: [{"id": "email", "value": "ntldr"}], required: false}) // для сваггера
  @ValidateNested({ each: true })
  @Transform(({ value }) => JSON.parse(value))
  @IsOptional() // для валидации обязательность
  @Type(()=>filter)
  filters: filter[];
  
  @IsArray()
  @ApiProperty({ description: 'Array of search keys', isArray: true, type: [filter], example: [{"id": "email", "value": "ntldr"}], required: false}) // для сваггера
  @ValidateNested({ each: true })
  @Transform(({ value }) => JSON.parse(value))
  @IsOptional() // для валидации обязательность
  @Type(()=>sorting)
  sorting: sorting[];

  @Transform(({value}) => parseInt(value)) 
  @ApiProperty({example: 20, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  @IsOptional() // для валидации обязательность
  size: number;

  @Transform(({value}) => parseInt(value)) 
  @ApiProperty({example: 20, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  @IsOptional() // для валидации обязательность
  start: number;

  @ApiProperty({example: 'ntldr', required: false}) // для сваггера
  @IsString() // для валидации типа
  @IsOptional() // для валидации обязательность
  globalFilter: string;  

}


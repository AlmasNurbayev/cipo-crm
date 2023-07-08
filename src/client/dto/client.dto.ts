import { ApiProperty } from "@nestjs/swagger";
import { Transform, Type } from "class-transformer";
//import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsDate, IsNumber, IsOptional, IsString } from "class-validator";
import { subscribeDto, subscribeSmallDto } from "src/subscribe/dto/subscribe.dto";

export class ClientDto {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ example: 'abc@abc.kz' })
  @IsString()
  email: string;

  @ApiProperty({ example: '+7 701 777 7777' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Ivan Petrov' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Astana' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Алматинский район' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'Добавить программы лояльности' })
  @IsString()
  wish: string


  @IsArray()
  @ApiProperty({ type: [subscribeSmallDto], required: false }) // для сваггера
  @IsOptional() // для валидации обязательность
  //@isArray()
  @Type(() => subscribeSmallDto)
  subscribe: subscribeSmallDto[]


  @ApiProperty({ example: '2023-04-16 10:00' })
  @IsDate()
  create_date: Date;

  @ApiProperty({ example: '2023-04-16 10:00' })
  @IsDate()
  changed_date: Date;
}

export class ClientCreateDto {

  @ApiProperty({ example: 'abc@abc.kz' })
  @IsString()
  email: string;

  @ApiProperty({ example: '+7 701 777 7777' })
  @IsString()
  phone: string;

  @ApiProperty({ example: 'Ivan Petrov' })
  @IsString()
  name: string;

  @ApiProperty({ example: 'Astana' })
  @IsString()
  city: string;

  @ApiProperty({ example: 'Алматинский район' })
  @IsString()
  district: string;

  @ApiProperty({ example: 'Добавить программы лояльности' })
  @IsString()
  wish: string


}


export class ClientListDTO {
  @IsArray()
  @ApiProperty({ type: [ClientDto], required: false }) // для сваггера
  @Type(() => ClientDto)
  data: ClientDto[]

  @ApiProperty({ example: 100 })
  @IsNumber()
  totalCount: number | undefined
}


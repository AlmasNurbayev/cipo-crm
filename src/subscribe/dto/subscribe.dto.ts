import { ApiProperty } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsArray, IsBoolean, IsString, IsDate, IsNumber, IsOptional, isArray } from "class-validator";

export class subscribeDto {
  

  @ApiProperty({example: 1, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  @IsOptional() // для валидации обязательность
  id: number;

  
  @ApiProperty({example: 1, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  @IsOptional() // для валидации обязательность
  client_id: number;

  
  @ApiProperty({example: true, required: false}) // для сваггера
  @IsBoolean()
  @IsOptional() // для валидации обязательность
  sms_send: boolean;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({example: '2023-04-16 10:00', required: false})
  sms_date_end?: Date;

  
  @ApiProperty({example: true, required: false}) // для сваггера
  @IsBoolean()
  @IsOptional()
  email_send: boolean;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({example: '2023-04-16 10:00', required: false})
  email_date_end?: Date;
  
  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({example: '2023-04-16 10:00', required: false})
  create_date: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({example: '2023-04-16 10:00', required: false})
  changed_date: Date;
}


// дял включения в ответы по клиентам 
export class subscribeSmallDto {
  

  @ApiProperty({example: 1, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  @IsOptional() // для валидации обязательность
  id: number;

  @ApiProperty({example: 1, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  @IsOptional() // для валидации обязательность
  client_id: number;  
  
  @ApiProperty({example: true, required: false}) // для сваггера
  @IsBoolean()
  @IsOptional() // для валидации обязательность
  sms_send: boolean;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({example: '2023-04-16 10:00', required: false})
  sms_date_end?: Date;

  
  @ApiProperty({example: true, required: false}) // для сваггера
  @IsBoolean()
  @IsOptional()
  email_send: boolean;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({example: '2023-04-16 10:00', required: false})
  email_date_end?: Date;
  
}


// для включения в ответ по подпискам
class ClientSmallDto {
  
  @ApiProperty({example: 1, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  id: number;

  @ApiProperty({example: 'abc@abc.kz', required: false})
  @IsString()
  email: string;

  @ApiProperty({example: '+7 701 777 7777', required: false})
  @IsString()
  phone: string;

  @ApiProperty({example: 'Ivan Petrov'})
  @IsString()
  name: string;


}


export class subscribeWithClientDTO {
  @ApiProperty({example: 1, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  @IsOptional() // для валидации обязательность
  id: number;
  
  @ApiProperty({example: 1, required: false}) // для сваггера
  @IsNumber() // для валидации типа
  @IsOptional() // для валидации обязательность
  client_id: number;

  
  @ApiProperty({example: true, required: false}) // для сваггера
  @IsBoolean()
  @IsOptional() // для валидации обязательность
  sms_send: boolean;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({example: '2023-04-16 10:00', required: false})
  sms_date_end?: Date;

  
  @ApiProperty({example: true, required: false}) // для сваггера
  @IsBoolean()
  @IsOptional()
  email_send: boolean;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({example: '2023-04-16 10:00', required: false})
  email_date_end?: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({example: '2023-04-16 10:00', required: false})
  create_date: Date;

  @Type(() => Date)
  @IsDate()
  @IsOptional()
  @ApiProperty({example: '2023-04-16 10:00', required: false})
  changed_date: Date;

  @IsArray()
  @ApiProperty({type: [ClientSmallDto], required: false}) // для сваггера
  @IsOptional() // для валидации обязательность
  @Type(()=> ClientSmallDto)
  client: ClientSmallDto[];

}

export class subscribeListDTO {
  @IsArray()
  @ApiProperty({type: [subscribeWithClientDTO], required: false}) // для сваггера
  @IsOptional() // для валидации обязательность
  @Type(()=>subscribeWithClientDTO)
  data: subscribeWithClientDTO[]

  @ApiProperty({example: 100})
  @IsNumber()  
  totalCount: number | undefined
}



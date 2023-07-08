import { ApiProperty } from "@nestjs/swagger";
import { IsDate, IsNumber, IsOptional, IsString } from "class-validator";

export class FilterUserDto {

  @ApiProperty({example: 1})
  @IsNumber()
  @IsOptional() // для валидации обязательность
  id: number;

  @ApiProperty({example: 'abc@abc.kz'})
  @IsString()  
  @IsOptional() // для валидации обязательность
  email: string;

  @ApiProperty({example: '+7 701 777 7777'})
  @IsString()  
  @IsOptional() // для валидации обязательность
  phone: string;

  @ApiProperty({example: 'Ivan Petrov'})
  @IsString()
  @IsOptional() // для валидации обязательность
  name: string;

  @ApiProperty({example: 'user'})
  @IsString()
  @IsOptional() // для валидации обязательность
  role: string;  

  @ApiProperty({example: '2023-04-16 10:00'})
  @IsDate()
  @IsOptional() // для валидации обязательность
  create_date: Date;
  
  @ApiProperty({example: '2023-04-16 10:00'})
  @IsDate()
  @IsOptional() // для валидации обязательность
  changed_date: Date;  

}

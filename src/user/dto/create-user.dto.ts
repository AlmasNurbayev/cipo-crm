import { ApiProperty } from "@nestjs/swagger";
import { IsOptional, IsString } from "class-validator";

export class CreateUserDto {

  @ApiProperty({example: 'abc@abc.kz'})
  @IsString()  
  email: string;

  @ApiProperty({example: '+7 701 777 7777'})
  @IsString()  
  @IsOptional()
  phone: string;

  @ApiProperty({example: 'Ivan Petrov'})
  @IsString()
  @IsOptional()
  name: string;

  @ApiProperty({example: 'myPassWORd'})
  @IsString()
  password: string;

  @ApiProperty({example: 'user'})
  @IsString()
  @IsOptional()
  role: string;  
}

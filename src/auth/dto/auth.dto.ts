import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class AuthDto {

  @ApiProperty({example: 'abc@abc.kz'})
  @IsString()
  @IsNotEmpty()
  email: string;

  @ApiProperty({example: 'myPassWORd'})
  @IsString()
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
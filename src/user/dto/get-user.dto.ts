import { ApiProperty, PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class GetUserDto extends PartialType(CreateUserDto) {

  @ApiProperty({example: 1})
  @IsNumber()
  id: number;

  @ApiProperty({example: '2023-04-16 10:00'})
  @IsDate()
  create_date: Date;
  
  @ApiProperty({example: '2023-04-16 10:00'})
  @IsDate()
  changed_date: Date;  

  @ApiProperty({example: '******'})
  @IsString()
  salt: string;

}
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DatabaseService } from '../database/database.service';
import { logger } from '../utils/logs';
import { FilterUserDto } from './dto/filter-user-dto';
import * as bcrypt from 'bcryptjs';


@Injectable()
export class UserService {
  constructor(private readonly databaseService: DatabaseService) { }

  async create(dto: CreateUserDto) {
    //dto.create_date = new Date;
    const hashedPassword = await bcrypt.hash(
      dto.password,
      10,
    );
    dto.password = hashedPassword;

    dto.role = 'user';
    const res = this.databaseService.user.create({
      data: dto,
    });
    logger.info('UserService - create - end ' + JSON.stringify(dto));
    return res;    
    //return 'This action adds a new user';
  }

  findAll(dto: FilterUserDto) {
    const res = this.databaseService.user.findMany({
      where: dto,
    });
    logger.info('UserService - findAll - end ' + JSON.stringify(dto));
    return res;
  }

  findOne(id: number) {
    const res = this.databaseService.user.findUnique({
      where: { id: id }
    });
    logger.info('UserService - findOne - end ' + id);
    return res;
  }

  // функция нужна только для класса авторизации, не используется в роутах
  findEmail(email: string) {
    const res = this.databaseService.user.findUnique({
      where: { email: email }
    });
    logger.info('UserService - findEmail - end ' + email);
    return res;
  }


  async update(id: number, dto: UpdateUserDto) {

    if (dto.password) {
      dto.password = await bcrypt.hash(
        dto.password,
        10,
      );
    }    

    const res = this.databaseService.user.update({
      data: dto,
      where: { id: id }
    });
    logger.info('UserService - update - end ' + id);
    return res;
  }

  remove(id: number) {
    const res = this.databaseService.user.delete({
      where: { id: id }
    });
    logger.info('UserService - remove - end ' + id);
    return res;
  }
}

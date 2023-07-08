import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, ParseIntPipe, Query, UseGuards, NotFoundException } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { GetUserDto } from './dto/get-user.dto';
import { FilterUserDto } from './dto/filter-user-dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { logger } from '../utils/logs';

@ApiTags('Users')
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOperation({summary: 'create user'})
  @ApiResponse ({status: 201, type: GetUserDto})
  @ApiBody({ type: CreateUserDto})
  @UsePipes(new ValidationPipe)
  @Post('create')
  async create(@Body() createUserDto: CreateUserDto) {
    return await this.userService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)  
  @ApiBearerAuth()  
  @ApiOperation({summary: 'get all users by filters'})
  @ApiResponse ({status: 200, type: [GetUserDto]})
  @UsePipes(new ValidationPipe({transform: true}))  
  @Get('all')
  async findAll(@Query() query: FilterUserDto) {
    const res = await this.userService.findAll(query);
    return res;
  }

  @UseGuards(JwtAuthGuard)  
  @ApiBearerAuth()  
  @ApiOperation({summary: 'get user by id'})
  @ApiResponse ({status: 200, type: GetUserDto})
  @ApiNotFoundResponse({ description: 'id # does not exist'})
  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const res = await this.userService.findOne(+id);
    //console.log(res);
    
    if (!res) {
      logger.error('user.controller - id ' + id +  ' object not found');
      throw new NotFoundException(`id ${id} object not found`);
    }       
    return res;    
  }

  @UseGuards(JwtAuthGuard)  
  @ApiBearerAuth()    
  @ApiOperation({summary: 'update user data by id'})
  @ApiResponse ({status: 200, type: UpdateUserDto})
  @ApiNotFoundResponse({ description: 'id # does not exist'})
  @ApiBody({ type: UpdateUserDto})
  @UsePipes(new ValidationPipe)
  @Patch(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    const res = await this.userService.update(+id, updateUserDto);
    if (!res) {
      logger.error('user.controller - id ' + id +  ' object not found');
      throw new NotFoundException(`id ${id} object not found`);
    }       
    return res;     
  }

  @UseGuards(JwtAuthGuard)  
  @ApiBearerAuth()  
  @ApiOperation({summary: 'delete user by id'})
  @ApiResponse ({status: 200, type: GetUserDto})
  @ApiNotFoundResponse({ description: 'id # does not exist'})
  @UsePipes(new ValidationPipe)  
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const res = await this.userService.remove(+id);
    if (!res) {
      logger.error('user.controller - id ' + id +  ' object not found');
      throw new NotFoundException(`id ${id} object not found`);
    }       
    return res; 
  }
}

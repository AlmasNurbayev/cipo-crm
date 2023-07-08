import { Body, Controller, Delete, Get, NotFoundException, Param, ParseIntPipe, Patch, Post, Query, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { subscribeDto, subscribeListDTO } from './dto/subscribe.dto';
import { subscribeFilterDto } from './dto/subscribe_filter.dto';
import { ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { SubscribeService } from './subscribe.service'
import { logger } from '../utils/logs';

@ApiTags('Subscribes')
@Controller('subscribe')
export class SubscribeController {
  constructor(private readonly SubscribeService: SubscribeService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'create subscribe'})
  @ApiResponse ({status: 201, type: subscribeDto})
  @ApiBody({ type: subscribeDto})
  @UsePipes(new ValidationPipe)
  @Post('create')
  async create(@Body() dto: Omit<subscribeDto, 'id' | 'create_date' | 'changed_date'>) {
    const res = await this.SubscribeService.create(dto);
    return res;      
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'get all subscribe by filters'})
  @ApiResponse ({status: 200, type: subscribeListDTO})
  @UsePipes(new ValidationPipe({transform: true}))
  @Get('all') // запрос со всеми возможными фильтрами
  async getAll(@Query() query: subscribeFilterDto) {
    const res = await this.SubscribeService.getAll(query);
    return res;
  } 

  @UseGuards(JwtAuthGuard)  
  @ApiBearerAuth()
  @ApiOperation({summary: 'get subscribe by id'})
  @ApiResponse ({status: 200, type: subscribeDto})
  @ApiNotFoundResponse({ description: 'id # does not exist'})
  @Get(':id') 
  async getId(@Param('id', ParseIntPipe) id: number) {
    const res = await this.SubscribeService.getId(id);
    if (!res) {
      logger.error('subscribe.controller - id ' + id +  ' object not found');
      throw new NotFoundException(`id ${id} object not found`);
    }          

    return res;
  }   

  @UseGuards(JwtAuthGuard)  
  @ApiBearerAuth()
  @ApiOperation({summary: 'get subscribe by id'})
  @ApiResponse ({status: 200, type: [subscribeDto]})
  @ApiNotFoundResponse({ description: 'id # does not exist'})
  @Get('client/:id') 
  async getClientId(@Param('id', ParseIntPipe) id: number) {
    const res = await this.SubscribeService.getClientId(id);
    if (!res) {
      logger.error('subscribe.controller - by client id ' + id +  ' object not found');
      throw new NotFoundException(`id ${id} object not found`);
    }          

    return res;
  }  


  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'delete subscribe by id'})
  @ApiResponse ({status: 200, type: subscribeDto})
  @ApiNotFoundResponse({ description: 'object not found'})
  @UsePipes(new ValidationPipe)
  @Delete(':id')
  async deleteId(@Param('id', ParseIntPipe) id: number) {
    const res = await this.SubscribeService.deleteId(id);
    if (!res) {
      logger.error('subscribe.controller - id ' + id +  ' object not found');
      throw new NotFoundException(`id ${id} object not found`);
    }          
    logger.info('subscribe.controller - delete by id: ' + id + ' result: ' + JSON.stringify(res));
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'delete subscribe by id'})
  @ApiResponse ({status: 200, type: subscribeDto})
  @ApiNotFoundResponse({ description: 'object not found'})
  @UsePipes(new ValidationPipe)
  @Delete('client/:id')
  async deleteClientId(@Param('id', ParseIntPipe) id: number) {
    const res = await this.SubscribeService.deleteClientId(id);
    if (!res) {
      logger.error('subscribe.controller - id ' + id +  ' object not found');
      throw new NotFoundException(`id ${id} object not found`);
    }          
    logger.info('subscribe.controller - delete by client id: ' + id + ' result: ' + JSON.stringify(res));
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'update subscribe data by id'})
  @ApiResponse ({status: 200, type: subscribeDto})
  @ApiNotFoundResponse({ description: 'id # object not found'})
  @ApiBody({ type: subscribeDto})
  @UsePipes(new ValidationPipe)
  @Patch(':id')
  async patchId(@Param('id', ParseIntPipe) id: number, @Body() dto: Omit<subscribeDto, 'changed_date'>) {
    logger.info('subscribe.controller - patch by id: ' + id);
    const res = await this.SubscribeService.patchId(id, dto);
    if (!res) {
      logger.error('subscribe.controller - id ' + id +  ' object not found');
      throw new NotFoundException(`id ${id} object not found`);
    }          
    return res;   
  }

}

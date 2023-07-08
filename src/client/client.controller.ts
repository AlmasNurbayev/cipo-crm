import { Body, Controller, Get, Param, Post, 
  Delete, Patch, Query, UsePipes, ValidationPipe, 
  ParseIntPipe, NotFoundException, UseGuards 
} from '@nestjs/common';
import { ClientCreateDto, ClientDto, ClientListDTO } from './dto/client.dto';
import { ClientFilterDto } from './dto/client_filter.dto';
import { ClientService } from './client.service';
import { ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { logger } from '../utils/logs';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ClientFilter2Dto } from './dto/clientFilter2.dto';



@ApiTags('Clients')
@Controller('client')
export class ClientController {
  constructor(private readonly ClientService: ClientService) {}

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'create client'})
  @ApiResponse ({status: 201, type: ClientDto})
  @ApiBody({ type: ClientCreateDto})
  @UsePipes(new ValidationPipe)
  @Post('create')
  async create(@Body() dto: Omit<ClientDto, 'id' | 'changed_date'>) {
    const res = await this.ClientService.create(dto);
    return res;
  }  

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'get all clients by filters'})
  @ApiResponse ({status: 200, type: ClientListDTO})
  @UsePipes(new ValidationPipe({transform: true}))
  @Get('all') 
  async getAll(@Query() query: ClientFilterDto) {
      logger.info('client.controller - get filter: ' + JSON.stringify(query)); 
      const res = await this.ClientService.getAll(query);
      return res;
    }  

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'get all clients by filters' })
  @ApiResponse({ status: 200, type: ClientListDTO })
  @UsePipes(new ValidationPipe({ transform: true }))
  @Get('all2')
  async getAll2(@Query() query: ClientFilter2Dto) {
    logger.info('client.controller - get filter: ' + JSON.stringify(query));
    const res = await this.ClientService.getAll2(query);
    return res;
  }     

  @UseGuards(JwtAuthGuard)  
  @ApiBearerAuth()
  @ApiOperation({summary: 'get client by id'})
  @ApiResponse ({status: 200, type: ClientDto})
  @ApiNotFoundResponse({ description: 'id # does not exist'})
  @Get(':id') 
  async getId(@Param('id', ParseIntPipe) id: number) {
    logger.info('client.controller - get by id: ' + id);
    const res = await this.ClientService.getId(id);
    logger.info('client.controller - get by id: ' + JSON.stringify(res));
    if (!res) {
      logger.error('client.controller - id ' + id +  ' object not found');
      throw new NotFoundException(`id ${id} object not found`);
    }       
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'delete client by id'})
  @ApiResponse ({status: 200, type: ClientDto})
  @ApiNotFoundResponse({ description: 'object not found'})
  @UsePipes(new ValidationPipe)
  @Delete(':id')
  async deleteId(@Param('id', ParseIntPipe) id: number) {
    const res = await this.ClientService.deleteId(id);
    logger.info('client.controller - delete by id: ' + id + ' result: ' + JSON.stringify(res));
    return res;
  }

  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({summary: 'update client data by id'})
  @ApiResponse ({status: 200, type: ClientDto})
  @ApiNotFoundResponse({ description: 'id # object not found'})
  @ApiBody({ type: ClientCreateDto})
  @UsePipes(new ValidationPipe)
  @Patch(':id')
  async patchId(@Param('id', ParseIntPipe) id: number, @Body() dto: Omit<ClientDto, 'subscribe' | 'changed_date'>) {
    logger.info('client.controller - patch by id: ' + id);
    const res = await this.ClientService.patchId(id, dto);
    return res;    
  }


}

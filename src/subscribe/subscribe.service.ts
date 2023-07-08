import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { subscribeDto } from './dto/subscribe.dto';
import { subscribeFilterDto } from './dto/subscribe_filter.dto';
import { Prisma } from '@prisma/client';
import { ClientDto } from 'src/client/dto/client.dto';

@Injectable()
export class SubscribeService {
  constructor(private readonly databaseService: DatabaseService) { }


  async create(dto: Omit<subscribeDto, 'id' | 'create_date' | 'changed_date'>) {
    
    const res = this.databaseService.subscribe.create({
      data: dto,
    });
    // logger.info('ClientService - Create - end ' + JSON.stringify(dto));
    return res;
  }

  async getAll(dto: Pick<subscribeFilterDto, 'take' | 'skip'>) {

    console.log('dto', dto);
    const { take, skip, ...dto_small } = dto;
    console.log('dto_small', dto_small);
    

    let query: Prisma.subscribeFindManyArgs = {};
    query = {
      include: {
        client: {
          select: {
            id: true,
            phone: true,
            email: true,
            name: true,
          }
        }
      },
      where: dto_small,
    }

    if (dto.take) {
      query.take = take;
    }
    if (dto.skip) {
      query.skip = skip;
      delete dto.skip;
    }

    let query_count = structuredClone(query);
    delete query_count.include;
    if (query_count.take) {
      delete query_count.take;
    }
    if (query_count.skip) {
      delete query_count.skip;
    }
    console.log('query', JSON.stringify(query));    
    const res = await this.databaseService.subscribe.findMany(query);
    const res2 = await this.databaseService.subscribe.count(query_count as any);
    
    if (Array.isArray(res)) {
      return {
        data: res,
        totalCount: res2,
      };
    } else {
      return res;
    }
  }



  async getId(id: number) {
    const res = this.databaseService.subscribe.findUnique({
      where: { id: id }
    });
    return res;
  }

  async getClientId(id: number) {
    const res = this.databaseService.client.findUnique({
      where: { id: id },
      include: {
        subscribe: {
          select: {
            id: true,
            sms_send: true,
            email_send: true,
          }
        },
      },
    });

    if (res.subscribe) {
      return res.subscribe;
    }
    return res;
  }


  async deleteId(id: number) {
    const res = await this.databaseService.subscribe.delete({
      where: { id: id }
    });
    //console.log('delete res', res);
    // logger.info('ClientService - getId - end ' + id);
    return res;
  }

  async deleteClientId(id: number) {
    const res = await this.databaseService.subscribe.deleteMany({
      where: { client_id: id }
    });
    //console.log('delete res', res);
    // logger.info('ClientService - getId - end ' + id);
    return res;
  }
  


  async patchId(id: number, dto: Omit<subscribeDto, 'changed_date'>) {
    const res = this.databaseService.subscribe.update({
      data: dto,
      where: { id: id }
    });
    // logger.info('ClientService - getId - end ' + id);
    return res;
  }




}

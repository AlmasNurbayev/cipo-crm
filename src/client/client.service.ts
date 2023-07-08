import { Injectable, NotFoundException } from '@nestjs/common';
import { ClientCreateDto, ClientDto } from './dto/client.dto';
import { DatabaseService } from '../database/database.service';
import { logger } from '../utils/logs';
import { ClientFilterDto } from './dto/client_filter.dto';
import { Prisma } from '@prisma/client';
import { ClientFilter2Dto } from './dto/clientFilter2.dto';
//import { formatISO } from 'date-fns';


@Injectable()
export class ClientService {
  constructor(private readonly databaseService: DatabaseService) { }


  async create(dto: Omit<ClientCreateDto, 'id' | 'changed_date'>) {
    //dto.create_date = new Date;
    const res = this.databaseService.client.create({
      data: dto,
    });
    // logger.info('ClientService - Create - end ' + JSON.stringify(dto));
    return res;
  }

  async getAll2(dto: ClientFilter2Dto) {
    //logger.info('client service ' + JSON.stringify(dto));
    //console.log(dto);
    const { start, size, filters, sorting } = dto;
    let query: Prisma.clientFindManyArgs = {};
    query.skip = start;
    query.take = size;
    query.include = {
      subscribe: {
        select: {
          id: true,
          sms_send: true,
          email_send: true,
          sms_date_end: true,
          email_date_end: true,
          client_id: true,
        },
        orderBy: {
          id: 'desc',
        },
        take: 1,
      },
    };
    if (sorting) {
      query.orderBy = {};
      sorting.forEach(item => {
        if (!item.id.includes('send')) { // если это обычные поля, не связанные с subscribe
          query.orderBy[item.id] = item.desc === true ? 'desc' : 'asc';
        } // сортировать по полям связанной таблицы не выйдет, т.к. может быть много subscribe
      })
    }

    if (filters) {
      query.where = {};
      filters.forEach(item => {
        console.log(item.id);

        if (item.id.includes('id')) {
          query.where[item.id] = {
            in: Number(item.value),
          }
        } else if (item.id.includes('send')) {
          //&& Boolean(item.value) === true
          query.where.subscribe = {
            some: {
              [item.id]: {
                equals: item.value === 'true' ? true : false,
              }
            }
          }
        } else {
          query.where[item.id] = {
            contains: item.value,
            mode: 'insensitive'
          }
        }

      });
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

    let res: any = await this.databaseService.client.findMany(query);
    const res2 = await this.databaseService.client.count(query_count as any);
    // logger.info('ClientService - getAll - end ' + JSON.stringify(dto));
    if (Array.isArray(res)) {

      if (filters) { // пост фильтрация (после запроса)
        filters.forEach(item => {
          //console.log('item', item);
          
          if (item.id === 'sms_send' || item.id === 'email_send') {
            res = res.filter((elm) => {
              if (elm.subscribe.length > 0) {
                if (String(elm.subscribe[0][item.id]) === item.value) {
                  return elm;
                }
              } else  {
                if (item.value === 'false') { // если нет подписки то возвращаем все на запрос false
                  return elm;
                }
              }
            })
          }
        })
      }

      let result = {
        data: res,
        totalCount: res2,
      };
      //console.log(result);
      return result;
    } else {
      return res;

    }
  }


  async getAll(dto: Pick<ClientFilterDto, 'take' | 'skip' | 'search'>) {

    const { search, take, skip, ...dto_small } = dto;

    let query: Prisma.clientFindManyArgs = {};
    query = {
      where: dto_small,
      include: {
        subscribe: {
          select: {
            id: true,
            sms_send: true,
            email_send: true,
            sms_date_end: true,
            email_date_end: true,
            client_id: true,
          }
        },
      }
    }

    if (search) { // формируем скрипт поиска по нескольким полям
      query.where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
        { phone: { contains: search, mode: 'insensitive' } },
        { city: { contains: search, mode: 'insensitive' } },
      ]
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

    //console.log(JSON.stringify(query));

    const res = await this.databaseService.client.findMany(query);
    const res2 = await this.databaseService.client.count(query_count as any);
    // logger.info('ClientService - getAll - end ' + JSON.stringify(dto));
    if (Array.isArray(res)) {
      let result = {
        data: res,
        totalCount: res2,
      };
      return result;
    } else {
      return res;
    }



  }

  async getId(id: number) {
    const res = this.databaseService.client.findUnique({
      where: { id: id }
    });

    // logger.info('ClientService - getId - end ' + id);
    return res;
  }

  async deleteId(id: number) {
    const res = await this.databaseService.client.delete({
      where: { id: id }
    });
    //console.log('delete res', res);
    // logger.info('ClientService - getId - end ' + id);
    return res;
  }

  async patchId(id: number, dto: Omit<ClientDto, 'changed_date' | 'subscribe'>) {

    const res = this.databaseService.client.update({
      data: dto,
      where: { id: id }
    });
    // logger.info('ClientService - getId - end ' + id);
    return res;
  }

}

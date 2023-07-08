import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClientExceptionFilter } from '../src/prisma-client-exception/prisma-client-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { subscribeDto } from 'src/subscribe/dto/subscribe.dto';
import { DatabaseService } from '../src/database/database.service';



const loginDto: AuthDto = {
  email: process.env.TEST_LOGIN,
  password: process.env.TEST_PASSWORD
}

const testDto:Omit<subscribeDto, 'id' | 'create_date' | 'changed_date'> = { 
  client_id: 2107,
  sms_send: true,
  email_send: true,
  //email_date_end: null,
  //sms_date_end: null,
}

describe('User controller (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let DatabaseService: DatabaseService;
  let createID: number;
  
  afterAll(async () => {
    await app.close();
    // await DatabaseService.$disconnect();  // CHANGE
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      //providers: [DatabaseService],
    }).compile();
    
    // запуск Nest
    app = moduleFixture.createNestApplication();
    //DatabaseService = moduleFixture.get(DatabaseService);
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    await app.init();

      //авторизация
        const res = await request(app.getHttpServer())
        .post('/auth/login')
        .send(loginDto);
      token = res.body.accessToken;
      //console.log('res', res);    

      
  });

  //console.log('token', token);
  

  it('/subscribe/create (POST)', () =>{
    return request(app.getHttpServer())
      .post('/subscribe/create')
      .set('Authorization', 'Bearer ' + token)
      .send(testDto)
      .expect(201)
      .then(({body}: request.Response) => {
        //token = body.accessToken;
        createID = body.id;
        expect(createID).toBeDefined;
      });
  });


  it('/subscribe/:id (GET by id)', () =>{
    return request(app.getHttpServer())
      .get('/subscribe/'+String(createID))
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({body}: request.Response) => {
        createID = body.id;
        expect(createID).toBeDefined;
      });
  });  

  it('/subscribe/all (GET all)', () =>{
    return request(app.getHttpServer())
      .get('/subscribe/all')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body.length).toBeGreaterThan(1);
      });
  });  

  it('/subscribe/:id (GET by id) - fail', () =>{
    return request(app.getHttpServer())
      .get('/subscribe/'+String(createID+100))
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
  });  

  it('/subscribe/:id (DELETE) - fail', () =>{
    return request(app.getHttpServer())
      .delete('/subscribe/'+String(createID+100))
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
  });  

  it('/subscribe/:id (PATCH)', () =>{
    return request(app.getHttpServer())
      .patch('/subscribe/'+String(createID))
      .set('Authorization', 'Bearer ' + token)
      .send(testDto)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body.id).toBeDefined;
      });
  });

  it('/subscribe/:id (DELETE)', () =>{
    return request(app.getHttpServer())
      .delete('/subscribe/'+createID)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body.id).toBeDefined;
      });
  });




});

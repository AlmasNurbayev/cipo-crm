import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { ClientCreateDto } from 'src/client/dto/client.dto';
import { PrismaClientExceptionFilter } from '../src/prisma-client-exception/prisma-client-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { AuthDto } from '../src/auth/dto/auth.dto';
import { DatabaseService } from '../src/database/database.service';


const testDto:ClientCreateDto = {
    "email": "ntldr_test@mail.ru",
    "city": "Astana",
    "phone": "+7 701 5135131",
    "name": "almas",
    "district": "SaryArka",
    "wish": "bonus",    
}

const loginDto: AuthDto = {
  email: process.env.TEST_LOGIN,
  password: process.env.TEST_PASSWORD
}

//console.log('loginDto', loginDto);



describe('Client controller (e2e)', () => {
  let app: INestApplication;
  let createID: number;
  let token: string;
  let DatabaseService: DatabaseService;

  afterAll(async () => {
    await app.close();
    // await DatabaseService.$disconnect();  // CHANGE
  });

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    // запуск Nest
    app = moduleFixture.createNestApplication();
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
  

  it('/client/create (POST)', () =>{
    return request(app.getHttpServer())
      .post('/client/create')
      .set('Authorization', 'Bearer ' + token)
      .send(testDto)
      .expect(201)
      .then(({body}: request.Response) => {
        createID = body.id;
        expect(createID).toBeDefined;
      });
  });

  it('/client/:id (GET by id)', () =>{
    return request(app.getHttpServer())
      .get('/client/'+createID)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({body}: request.Response) => {
        createID = body.id;
        expect(createID).toBeDefined;
      });
  });

  it('/client/:id (GET by id) - fail', () =>{
    return request(app.getHttpServer())
      .get('/client/'+String(createID+100))
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
  });  

  it('/client/all (GET all)', () =>{
    return request(app.getHttpServer())
      .get('/client/all')
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body.length).toBeGreaterThan(1);
        
      });
  });  

  it('/client/all (GET all) by id - fail', () =>{
    return request(app.getHttpServer())
      .get('/client/all?id=' + String(createID+100))
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body.length).toBe(0);
        
      });
  });    

  it('/client/:id (DELETE)', () =>{
    return request(app.getHttpServer())
      .delete('/client/'+createID)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({body}: request.Response) => {
        createID = body.id;
        expect(createID).toBeDefined;
      });
  });

  it('/client/:id (DELETE) - fail', () =>{
    return request(app.getHttpServer())
      .delete('/client/'+String(createID+100))
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
  });  


});

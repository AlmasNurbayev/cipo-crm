import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaClientExceptionFilter } from '../src/prisma-client-exception/prisma-client-exception.filter';
import { HttpAdapterHost } from '@nestjs/core';
import { AuthDto } from 'src/auth/dto/auth.dto';
import { DatabaseService } from '../src/database/database.service';
import { afterEach } from 'node:test';



const loginDto: AuthDto = {
  email: 'ntldr_test@mail.ru',
  password: 'A123456'
}


//console.log('loginDto', loginDto);

describe('User controller (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let email: string
  let createID: number;
  let prisma: DatabaseService;


  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      providers: [DatabaseService],
    }).compile();

    app = moduleFixture.createNestApplication();
    let prisma = moduleFixture.get(DatabaseService);
    const { httpAdapter } = app.get(HttpAdapterHost);
    app.useGlobalFilters(new PrismaClientExceptionFilter(httpAdapter));
    await app.init();
  });

  afterAll(async () => {
    // await prisma.$disconnect();
    // await prisma.onModuleDestroy();
    await app.close();
  });

  it('/user/create (POST)', () =>{
    return request(app.getHttpServer())
      .post('/user/create')
      .send(loginDto)
      .expect(201)
      .then(({body}: request.Response) => {
        //token = body.accessToken;
        email = body.email;
        createID = body.id;
        expect(createID).toBeDefined;
      });
  });

  it('/auth/login (POST)', () =>{
    return request(app.getHttpServer())
      .post('/auth/login')
      .send(loginDto)
      .expect(200)
      .then(({body}: request.Response) => {
        //token = body.accessToken;
        token = body.accessToken;
        expect(token).toBeDefined;
      });
  });


  it('/user/all?:email (GET All)', () =>{
    return request(app.getHttpServer())
      .get('/user/all?email='+email)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({body}: request.Response) => {
        expect(body.id).toBeDefined;
      });
  });


  it('/user/:id (GET by id)', () =>{
    return request(app.getHttpServer())
      .get('/user/'+String(createID))
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({body}: request.Response) => {
        createID = body.id;
        expect(createID).toBeDefined;
      });
  });  

  it('/user/:id (GET by id) - fail', () =>{
    return request(app.getHttpServer())
      .get('/user/'+String(createID+100))
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
  });  

  it('/user/:id (DELETE) - fail', () =>{
    return request(app.getHttpServer())
      .delete('/user/'+String(createID+100))
      .set('Authorization', 'Bearer ' + token)
      .expect(404)
  });  

  it('/user/:id (DELETE)', () =>{
    return request(app.getHttpServer())
      .delete('/user/'+createID)
      .set('Authorization', 'Bearer ' + token)
      .expect(200)
      .then(({body}: request.Response) => {
        createID = body.id;
        expect(createID).toBeDefined;
      });
  });




});

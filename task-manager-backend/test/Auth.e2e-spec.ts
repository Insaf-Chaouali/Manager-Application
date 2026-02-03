import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { DataSource } from 'typeorm';

jest.setTimeout(60000);

describe('Auth  Integration (e2e)', () => {
  let app: INestApplication;
  let dataSource: DataSource;
  let jwtToken: string;

  beforeAll(async () => {
    process.env.JWT_SECRET = 'topSecret51';

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();

    dataSource = app.get(DataSource);
    await dataSource.query('TRUNCATE TABLE "user" CASCADE');
  });

  afterAll(async () => {
    if (app) await app.close();
  });

  describe('Auth Module', () => {
    const newUser = {
      firstName: 'Insaf',
      lastName: 'Chaouali',
      username: `insaf${Date.now()}`,
      email: `test-${Date.now()}@example.com`,
      password: 'Password1',
      dateBirth: '2005-02-03',
    };

    it('POST /auth/signup → should create a new user', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signup')
        .send(newUser);

      expect([201, 200]).toContain(response.status);
      expect(response.body).toHaveProperty('id');
    });

    it('POST /auth/signin → should return JWT token', async () => {
      const response = await request(app.getHttpServer())
        .post('/auth/signin')
        .send({ username: newUser.username, password: newUser.password });

      expect([200, 201]).toContain(response.status);
      expect(response.body).toHaveProperty('accessToken');

      let returned = response.body.accessToken;
      if (typeof returned === 'string' && returned.toLowerCase().startsWith('bearer ')) {
        returned = returned.split(' ')[1];
      }
      jwtToken = returned;
    });
  });

});
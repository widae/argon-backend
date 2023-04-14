import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';

describe('Health (e2e)', () => {
  const gql = '/graphql';
  let app: INestApplication;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  it('health', () => {
    return request(app.getHttpServer())
      .post(gql)
      .send({
        query: `{
          health { status }
        }`,
      })
      .expect(200);
  });

  afterAll(async () => {
    await app.close();
  });
});

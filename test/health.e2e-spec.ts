import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DATA_SOURCE } from '../src/common/constants';
import { DataSource } from 'typeorm';

describe('Health (e2e)', () => {
  const gql = '/graphql';
  let app: INestApplication;
  let ds: DataSource;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    ds = moduleRef.get<string, DataSource>(DATA_SOURCE);
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
    await ds.destroy();
    await app.close();
  });
});

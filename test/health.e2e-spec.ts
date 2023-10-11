import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DATA_SOURCE } from '../src/common/constants';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';

describe('Health (e2e)', () => {
  const gql = '/graphql';
  let app: INestApplication;
  let ds: DataSource;

  beforeAll(async () => {
    initializeTransactionalContext();

    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    ds = moduleRef.get<string, DataSource>(DATA_SOURCE);
  });

  describe('health', () => {
    it('#0', () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `{
            health {
              status
            }
          }`,
        })
        .expect(200)
        .expect((res) => {
          const expected = { status: 'ok' };

          let actual = {};

          const { data } = res.body;

          if (data != null) {
            actual = data.health;
          }

          expect(actual).toMatchObject(expected);
        });
    });
  });

  afterAll(async () => {
    await ds.destroy();
    await app.close();
  });
});

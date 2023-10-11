import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DATA_SOURCE } from '../src/common/constants';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';

describe('Auth (e2e)', () => {
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

  describe('logIn', () => {
    it('#0', () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              logIn(input: { email: "${process.env.TEST_USER_EMAIL}", password: "${process.env.TEST_USER_PASSWORD}" }) {
                accessToken
                refreshToken
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          let actual = null;

          const { data } = res.body;

          if (data != null) {
            actual = data.logIn;
          }

          expect(actual).toBeObject();
        });
    });
  });

  describe('refresh', () => {
    it('#0', () => {
      return request(app.getHttpServer())
        .post(gql)
        .set('Authorization', `Bearer ${process.env.TEST_REFRESH_TOKEN}`)
        .send({
          query: `
            mutation {
              refresh {
                accessToken
                refreshToken
              }
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          let actual = null;

          const { data } = res.body;

          if (data != null) {
            actual = data.refresh;
          }

          expect(actual).toBeObject();
        });
    });
  });

  afterAll(async () => {
    await ds.destroy();
    await app.close();
  });
});

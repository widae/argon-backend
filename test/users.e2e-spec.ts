import { Test } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { DATA_SOURCE } from '../src/common/constants';
import { DataSource } from 'typeorm';
import { initializeTransactionalContext } from 'typeorm-transactional';

describe('Users (e2e)', () => {
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

  describe('signUp', () => {
    it('#0', () => {
      return request(app.getHttpServer())
        .post(gql)
        .send({
          query: `
            mutation {
              signUp(
                input: {
                  email: "ba.widae@gmail.com"
                  password: "1234"
                  nickname: "widae"
                  policyIds: ["1"]
                  verificationId: "1"
                  verificationCode: "908953" # $2b$10$AyNK70j2jmYPPrkMQzWgbOCTIPQd1PxcRGkVrWfV0PykgK3sYEwFO
                }
              )
            }
          `,
        })
        .expect(200)
        .expect((res) => {
          const expected = 1;

          let actual = null;

          const { data } = res.body;

          if (data != null) {
            actual = data.signUp;
          }

          expect(actual).toBe(expected);
        });
    });
  });

  afterAll(async () => {
    await ds.destroy();
    await app.close();
  });
});

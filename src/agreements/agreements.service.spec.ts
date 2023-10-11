import { Test } from '@nestjs/testing';
import { AgreementsService } from './agreements.service';
import { AgreementsRepository } from './agreements.providers';
import {
  AGREEMENTS_REPOSITORY,
  POLICIES_REPOSITORY,
} from '../common/constants';
import { PoliciesRepository } from '../policies/policies.providers';

type MockType<T> = {
  [P in keyof T]?: jest.Mock;
};

jest.mock('typeorm-transactional', () => ({
  Transactional: () => () => ({}),
  Propagation: { MANDATORY: 'MANDATORY' },
}));

describe('AgreementsService', () => {
  let agreementsService: AgreementsService;
  const agreementsRepository: MockType<AgreementsRepository> = {
    insert: jest.fn(),
  };
  const policiesRepository: MockType<PoliciesRepository> = {
    getByIsRequired: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        AgreementsService,
        {
          provide: AGREEMENTS_REPOSITORY,
          useValue: agreementsRepository,
        },
        {
          provide: POLICIES_REPOSITORY,
          useValue: policiesRepository,
        },
      ],
    }).compile();

    agreementsService = moduleRef.get<AgreementsService>(AgreementsService);
  });

  describe('createAgreements', () => {
    it('#0', async () => {
      agreementsRepository.insert?.mockReturnValue({
        raw: { affectedRows: 1 },
      });
      policiesRepository.getByIsRequired?.mockReturnValue(
        Promise.resolve([{ id: '1' }]),
      );

      const expected = 1;

      const userId = '1';
      const policyIds = ['1', '2'];

      const actual = await agreementsService.createAgreements(
        userId,
        policyIds,
      );

      expect(actual).toBe(expected);
    });
  });
});

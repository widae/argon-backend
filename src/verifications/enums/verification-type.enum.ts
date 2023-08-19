import { registerEnumType } from '@nestjs/graphql';

export enum VerificationType {
  EMAIL = 'EMAIL',
}

registerEnumType(VerificationType, {
  name: 'VerificationType',
  description: `인증 유형`,
  valuesMap: {
    EMAIL: { description: `이메일 인증` },
  },
});

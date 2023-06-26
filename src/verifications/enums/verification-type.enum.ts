import { registerEnumType } from '@nestjs/graphql';

export enum VerificationType {
  EMAIL = 'EMAIL',
}

registerEnumType(VerificationType, {
  name: 'VerificationType',
});

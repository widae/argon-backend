import * as DataLoader from 'dataloader';

export interface NestDataLoader<ID, Type> {
  generateDataLoader(): DataLoader<ID, Type>;
}

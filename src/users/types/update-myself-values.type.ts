import { User } from '../user.model';

export type UpdateMyselfValues = Partial<
  Pick<User, 'nickname' | 'job' | 'desc'>
>;

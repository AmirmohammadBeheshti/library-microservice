import { UserLevel } from './user-level.enum';

export interface IUserInfo {
  _id: string;
  firstName: string;
  lastName: string;
  mobile: string;
  isAdmin: boolean;
  username: string;
  level: UserLevel;
}

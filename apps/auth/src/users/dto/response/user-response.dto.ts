import { UserLevel } from '@app/common';
import { User } from '../../schema/user.schema';

export class UserResponseDto {
  id: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  username: string;
  level: UserLevel;
  mobileNumber: string;
  constructor(user: User) {
    this.id = user._id.toString();
    this.firstName = user.firstName;
    this.lastName = user.lastName;
    this.isAdmin = user.isAdmin;
    this.level = user.level;
    this.username = user.username;
    this.mobileNumber = user.mobile;
  }
}

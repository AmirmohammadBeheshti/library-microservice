import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { UserRepository } from './user.repository';
import { User } from './schema/user.schema';
import { RegisterDto } from '@app/common';

@Injectable()
export class UsersService {
  constructor(private readonly userRepo: UserRepository) {}
  async addUser(userInfo: RegisterDto) {
    const password = await hash(userInfo.password);
    return await this.userRepo.create({ ...userInfo, password });
  }

  async getOneById(id: string) {
    return await this.userRepo.findOneOrFailed({ id });
  }
  async getOneByUsername(username: string) {
    return await this.userRepo.findOneOrFailed({ username });
  }

  async validateUser(password: string, mobileNumber: string) {
    const findUser = await this.getOneByUsername(mobileNumber);
    if (!findUser) throw new UnauthorizedException();
    const verifyPass = await this.verifyUserPassword(findUser, password);
    if (!verifyPass) {
      throw new UnauthorizedException();
    }
    return findUser;
  }
  async verifyUserPassword(user: User, password: string): Promise<boolean> {
    return verify(user.password, password);
  }
}

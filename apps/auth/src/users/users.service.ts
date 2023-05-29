import { Injectable, UnauthorizedException } from '@nestjs/common';
import { hash, verify } from 'argon2';
import { UserRepository } from './user.repository';
import { User } from './schema/user.schema';
import { RegisterDto } from '@app/common';
import { RpcException } from '@nestjs/microservices';

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
    console.log('username', username);
    if (username) {
      return await this.userRepo.findOneOrFailed({ username });
    }
    throw new RpcException({
      statusCode: 404,
      message: 'Not Found',
    });
  }

  async validateUser(password: string, username: string) {
    console.log('Run A', { password, username });
    const findUser = await this.getOneByUsername(username);
    console.log('Run b', findUser);
    if (!findUser)
      throw new RpcException({
        statusCode: 401,
        message: 'Unauthorized',
      });
    const verifyPass = await this.verifyUserPassword(findUser, password);
    if (!verifyPass) {
      throw new RpcException({
        statusCode: 401,
        message: 'Unauthorized',
      });
    }
    return findUser;
  }
  async verifyUserPassword(user: User, password: string): Promise<boolean> {
    return verify(user.password, password);
  }
}

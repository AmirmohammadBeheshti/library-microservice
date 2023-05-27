import { BaseSerializer } from '@app/common';
import { Injectable } from '@nestjs/common';
import { User } from './schema/user.schema';
import { UserResponseDto } from './dto/response';
import { Pagination } from '@app/common/database/repository.type';

@Injectable()
//set type of input
export class UserSerializer extends BaseSerializer<User, UserResponseDto> {
  public async serialize(user: User): Promise<UserResponseDto> {
    return new UserResponseDto(user);
  }

  public async serializePaginated(
    value: Pagination<User>,
  ): Promise<Pagination<UserResponseDto>> {
    const paginated: Pagination<UserResponseDto> =
      new Pagination<UserResponseDto>(
        value.items.map((user) => new UserResponseDto(user)),
        value.meta,
      );

    return paginated;
  }
}

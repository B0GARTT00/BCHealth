import { Injectable } from '@nestjs/common';
import { UserEntity } from './entities/users.entity';

@Injectable()
export class UsersService {
  private users: UserEntity[] = [];

  findAll() {
    return this.users;
  }
}

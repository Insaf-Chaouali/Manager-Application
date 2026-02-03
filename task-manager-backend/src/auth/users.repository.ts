import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';
import { SignUpDTO } from './DTO/auth-credentials.dto';
import * as bcrypt from 'bcrypt';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class UserRepository {
  constructor(private dataSource: DataSource) {}

  async createUser(signUpDto: SignUpDTO): Promise<void> {
    const { firstName, lastName, username, email, password, dateBirth } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.dataSource.getRepository(User).create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      dateBirth,
    });

    try {
      await this.dataSource.getRepository(User).save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('Username or email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.dataSource.getRepository(User).findOne({ where: { username } });
  }
}

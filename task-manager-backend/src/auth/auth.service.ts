import { Injectable, UnauthorizedException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from './entities/user.entity';
import { SignUpDTO, SignInDTO } from './DTO/auth-credentials.dto';
import { JwtPayload } from './strategies/jwt-payload.interface';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  // ✅ SignUp retourne l'utilisateur créé
  async signUp(signUpDto: SignUpDTO): Promise<User> {
    const { firstName, lastName, username, email, password, dateBirth } = signUpDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.usersRepository.create({
      firstName,
      lastName,
      username,
      email,
      password: hashedPassword,
      dateBirth,
    });

    try {
      return await this.usersRepository.save(user);
    } catch (error) {
      if (error.code === '23505') { // duplicate key
        throw new ConflictException('Username or email already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }
  }

  async signIn(signInDto: SignInDTO): Promise<{ accessToken: string }> {
    const { username, password } = signInDto;

    const user = await this.usersRepository.findOne({ where: { username } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const payload: JwtPayload = { sub: user.id, username: user.username };
      const accessToken = this.jwtService.sign(payload);
      return { accessToken };
    } else {
      throw new UnauthorizedException('Please check your login credentials');
    }
  }
}

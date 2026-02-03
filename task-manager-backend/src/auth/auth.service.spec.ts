import { Test } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt', () => ({
  genSalt: jest.fn().mockResolvedValue('salt'),
  hash: jest.fn().mockResolvedValue('hashed'),
  compare: jest.fn().mockResolvedValue(true),
}));

const SignUpDTO = { username: 'insaf', password: 'Insaf123@@', firstName: 'Insaf', lastName: 'C', email: 'insaf@gmail.com' };
const SignInDTO = { username: 'insaf', password: 'Insaf123@@' };

describe('AuthService short', () => {
  let service: AuthService;
  let repo: any;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: { create: jest.fn(), save: jest.fn(), findOne: jest.fn() } },
        { provide: JwtService, useValue: { sign: jest.fn().mockReturnValue('token') } },
      ],
    }).compile();

    service = module.get(AuthService);
    repo = module.get(getRepositoryToken(User));
  });

  it('signUp success', async () => {
    repo.create.mockReturnValue(SignUpDTO);
    repo.save.mockResolvedValue(SignUpDTO);
    await expect(service.signUp(SignUpDTO)).resolves.not.toThrow();
  });

  it('signUp conflict', async () => {
    repo.create.mockReturnValue(SignUpDTO);
    repo.save.mockRejectedValue({ code: '23505' });
    await expect(service.signUp(SignUpDTO)).rejects.toThrow(ConflictException);
  });

  it('signIn success', async () => {
    repo.findOne.mockResolvedValue({ ...SignInDTO, password: 'hashed' });
    await expect(service.signIn(SignInDTO)).resolves.toEqual({ accessToken: 'token' });
  });

  it('signIn fail', async () => {
    repo.findOne.mockResolvedValue(null);
    await expect(service.signIn(SignInDTO)).rejects.toThrow(UnauthorizedException);
  });
});

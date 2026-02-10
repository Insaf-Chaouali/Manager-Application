import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { InjectRepository } from '@nestjs/typeorm';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {
    super({
      // 1. On s'assure que le secret est une chaîne brute pour le test
      secretOrKey: 'topSecret51', 
      // 2. On extrait explicitement du header Authorization: Bearer <token>
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
    });
    console.log('🚀 Stratégie JWT initialisée avec le secret: topSecret51');
  }

  async validate(payload: JwtPayload): Promise<User> {
    console.log('✅ Payload reçu dans validate:', payload);
    const { username } = payload;
    const user = await this.userRepository.findOneBy({ username });

    if (!user) {
      console.log('❌ Utilisateur non trouvé pour:', username);
      throw new UnauthorizedException();
    }

    console.log('👤 Utilisateur authentifié:', user.username);
    return user;
  }
}
import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDTO, SignInDTO } from './DTO/auth-credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  // ✅ SignUp renvoie l'id de l'utilisateur pour les tests
  @Post('/signup')
  async signUp(@Body() signUpDto: SignUpDTO) {
    const user = await this.authService.signUp(signUpDto);
    return { id: user.id, username: user.username, email: user.email };
  }

  @Post('/signin')
  signIn(@Body() signInDto: SignInDTO): Promise<{ accessToken: string }> {
    return this.authService.signIn(signInDto);
  }
}

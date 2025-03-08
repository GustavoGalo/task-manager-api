import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CreateUserDto } from "src/domain/users/dto/create-user-dto";
import { LoginDto } from "src/domain/auth/dto/login-dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signUp(@Body() { email, password, name, username }: CreateUserDto) {
    return this.authService.signUp({ email, password, name, username });
  }

  @Post("signin")
  signIn(@Body() { email, password }: LoginDto) {
    return this.authService.signIn({ email, password });
  }
}

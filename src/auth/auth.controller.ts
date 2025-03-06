import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInInput, SignUpInput } from "./types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signUp(@Body() { email, password, name, username }: SignUpInput) {
    return this.authService.signUp({ email, password, name, username });
  }

  @Post("signin")
  signIn(@Body() { email, password }: SignInInput) {
    return this.authService.signIn({ email, password });
  }
}

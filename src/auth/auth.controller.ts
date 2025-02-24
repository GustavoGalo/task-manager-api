import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInInput, SignUpInput } from "./types";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("signup")
  signUp(@Body() body: SignUpInput) {
    const { email, password, name, username } = body;
    return this.authService.signUp(email, password, name, username);
  }

  @Post("signin")
  signIn(@Body() body: SignInInput) {
    const { email, password } = body;
    return this.authService.signIn(email, password);
  }
}

import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "src/domain/users/dto/create-user-dto";
import { LoginDto } from "src/domain/auth/dto/login-dto";
import { CommandBus } from "@nestjs/cqrs";
import { plainToClass } from "class-transformer";
import { SignUpCommand } from "./commands/sign-up/sign-up-command";
import { SignInCommand } from "./commands/sign-in/sign-in-command";

@Controller("auth")
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("signup")
  async signUp(@Body() body: CreateUserDto) {
    const query = plainToClass(SignUpCommand, body);
    return await this.commandBus.execute(query);
  }

  @Post("signin")
  async signIn(@Body() body: LoginDto) {
    const query = plainToClass(SignInCommand, body);
    return await this.commandBus.execute(query);
  }
}

import { Body, Controller, Post } from "@nestjs/common";
import { CreateUserDto } from "src/domain/users/dto/create-user-dto";
import { LoginDto } from "src/domain/auth/dto/login-dto";
import { QueryBus } from "@nestjs/cqrs";
import { SignUpQuery } from "./queries/sign-up/sign-up-query";
import { plainToClass } from "class-transformer";
import { SignInQuery } from "./queries/sign-up/sign-in-query";

@Controller("auth")
export class AuthController {
  constructor(private readonly queryBus: QueryBus) {}

  @Post("signup")
  async signUp(@Body() body: CreateUserDto) {
    const query = plainToClass(SignUpQuery, body);
    return await this.queryBus.execute(query);
  }

  @Post("signin")
  async signIn(@Body() body: LoginDto) {
    const query = plainToClass(SignInQuery, body);
    return await this.queryBus.execute(query);
  }
}

import { Body, Controller, Param, Post, Res } from "@nestjs/common";
import { CreateUserDto } from "src/domain/users/dto/create-user-dto";
import { LoginDto } from "src/domain/auth/dto/login-dto";
import { CommandBus } from "@nestjs/cqrs";
import { plainToClass } from "class-transformer";
import { SignUpCommand } from "./commands/sign-up/sign-up-command";
import { SignInCommand } from "./commands/sign-in/sign-in-command";
import { Response } from "express";
import { ConfirmEmailCommand } from "./commands/confirm-email/confirm-email-command";

@Controller("auth")
export class AuthController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post("signup")
  async signUp(@Body() body: CreateUserDto) {
    const command = plainToClass(SignUpCommand, body);
    return await this.commandBus.execute(command);
  }

  @Post("signin")
  async signIn(@Body() body: LoginDto) {
    const command = plainToClass(SignInCommand, body);
    return await this.commandBus.execute(command);
  }

  @Post("confirm-email/:confirmationToken")
  async confirmEmail(
    @Param("confirmationToken") confirmationToken: string,
    @Res() res: Response,
  ) {
    const command = plainToClass(ConfirmEmailCommand, {
      confirmationToken,
    });
    await this.commandBus.execute(command);
    return res.status(302).redirect(`${process.env.FRONT_URL}/login`);
  }
}

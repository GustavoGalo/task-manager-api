import { Body, Controller, Param, Post, Res } from "@nestjs/common";
import { CreateUserDto } from "src/domain/users/dto/create-user-dto";
import { LoginDto } from "src/domain/auth/dto/login-dto";
import { CommandBus } from "@nestjs/cqrs";
import { plainToClass } from "class-transformer";
import { SignUpCommand } from "./commands/sign-up/sign-up-command";
import { SignInCommand } from "./commands/sign-in/sign-in-command";
import { Response } from "express";
import { ConfirmEmailCommand } from "./commands/confirm-email/confirm-email-command";
import { ForgotPasswordDto } from "src/domain/auth/dto/forgot-password-dto";
import { ForgotPasswordCommand } from "./commands/forgot-password/forgot-password-command";
import { ResetPasswordDto } from "src/domain/auth/dto/reset-password-dto";
import { ResetPasswordCommand } from "./commands/reset-password/reset-password-command";

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

  @Post("forgot-password")
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    const command = plainToClass(ForgotPasswordCommand, body);
    return await this.commandBus.execute(command);
  }

  @Post("reset-password/:resetToken")
  async resetPassword(@Param("resetToken") resetToken: string, @Body() body: ResetPasswordDto) {
    const command = plainToClass(ResetPasswordCommand, { resetToken, password: body.password });
    return await this.commandBus.execute(command);
  }
}

import { IsNotEmpty } from "class-validator";

import { IsEmail } from "class-validator";

export class ForgotPasswordDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;
}


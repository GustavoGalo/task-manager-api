import { IsNotEmpty } from "class-validator";
import { IsString } from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty()
  @IsString()
  password: string;
}


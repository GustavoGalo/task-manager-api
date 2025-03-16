import { ConfirmEmailHandler } from "./confirm-email/confirm-email-handler";
import { ForgotPasswordHandler } from "./forgot-password/forgot-password-handler";
import { ResetPasswordCommandHandler } from "./reset-password/reset-password-handler";
import { SignInHandler } from "./sign-in/sign-in-handler";
import { SignUpHandler } from "./sign-up/sign-up-handler";

export const CommandHandlers = [
  SignUpHandler,
  SignInHandler,
  ConfirmEmailHandler,
  ForgotPasswordHandler,
  ResetPasswordCommandHandler
];

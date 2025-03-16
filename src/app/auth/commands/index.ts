import { ConfirmEmailHandler } from "./confirm-email/confirm-email-handler";
import { SignInHandler } from "./sign-in/sign-in-handler";
import { SignUpHandler } from "./sign-up/sign-up-handler";

export const CommandHandlers = [
  SignUpHandler,
  SignInHandler,
  ConfirmEmailHandler,
];

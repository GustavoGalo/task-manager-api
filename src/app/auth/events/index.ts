import { ForgotPasswordSentEmailEventHandler } from "./forgot-password/forgot-password-event-handler";
import { UserSignedUpSendEmailEventHandler } from "./user-signed-up/user-signed-up-send-email-event-handler";

export const EventHandlers = [
  UserSignedUpSendEmailEventHandler,
  ForgotPasswordSentEmailEventHandler
];

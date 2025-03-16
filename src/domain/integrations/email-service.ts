export interface EmailService {
  sendSignUpEmail(data: {
    email: string;
    confirmation_link: string;
  }): Promise<void>;

  sendForgotPasswordEmail(data: {
    email: string;
    reset_link: string;
  }): Promise<void>;
}

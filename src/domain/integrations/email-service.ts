export interface EmailService {
  sendSignUpEmail(data: {
    email: string;
    confirmation_link: string;
  }): Promise<void>;
}

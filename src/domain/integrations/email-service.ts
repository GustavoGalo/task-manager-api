export interface EmailService {
  sendSignUpEmail(data: { email: string; code: string }): Promise<void>;
}

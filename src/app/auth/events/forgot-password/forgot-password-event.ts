export class ForgotPasswordEvent {
  constructor(
    public readonly email: string,
    public readonly resetToken: string
  ) {}
}


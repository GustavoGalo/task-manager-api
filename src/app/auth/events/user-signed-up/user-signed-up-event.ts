export class UserSignedUpEvent {
  constructor(
    public readonly email: string,
    public readonly confirmationCode: string,
  ) {}
}

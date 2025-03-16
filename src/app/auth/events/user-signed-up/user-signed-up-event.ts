export class UserSignedUpEvent {
  constructor(
    public readonly email: string,
    public readonly confirmationToken: string,
  ) {}
}

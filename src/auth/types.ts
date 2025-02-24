export interface SignUpInput {
  email: string;
  password: string;
  name: string;
  username: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

export interface Payload {
  sub: string;
  username: string;
}

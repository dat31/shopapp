export class LoginDto {
  username: string;
  password: string;
}

export class RegisterDto extends LoginDto {}

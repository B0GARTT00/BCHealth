import { IsEmail, IsString, Matches, MinLength } from 'class-validator';

export class LoginDto {
  @IsEmail()
  @Matches(/^[^@\s]+@brokenshire\.edu\.ph$/i, { message: 'Email must use the @brokenshire.edu.ph domain.' })
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class SignupDto {
  @IsEmail()
  @Matches(/^[^@\s]+@brokenshire\.edu\.ph$/i, { message: 'Email must use the @brokenshire.edu.ph domain.' })
  email!: string;

  @IsString()
  @MinLength(2)
  displayName!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class RefreshDto {
  @IsString()
  refreshToken!: string;
}

export class LogoutDto {
  @IsString()
  refreshToken!: string;
}

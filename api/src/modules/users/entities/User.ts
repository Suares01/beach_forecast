import { v4 as uuid } from "uuid";

import { UnprocessableEntityError } from "@core/errors/UnprocessableEntityError";

import { CreateUserDto } from "../dtos/createUser.dto";

export interface IUser {
  id: string;
  username: string;
  email: string;
  password: string;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type UserData = Omit<IUser, "password">;

export class User {
  private readonly props: IUser;

  get id(): string {
    return this.props.id;
  }

  get username(): string {
    return this.props.username;
  }

  get email(): string {
    return this.props.email;
  }

  get password(): string {
    return this.props.password;
  }

  get verified(): boolean {
    return this.props.verified;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  static validateUsername(username: string): void {
    const validateUsername = /^[a-z0-9_]{3,16}$/;

    if (!validateUsername.test(username)) {
      throw new UnprocessableEntityError("Username is invalid");
    }
  }

  static validateEmail(email: string): void {
    const validateEmail =
      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

    if (!validateEmail.test(email)) {
      throw new UnprocessableEntityError("Email is invalid");
    }
  }

  static validatePassword(password: string): void {
    if (password.length < 6) {
      throw new UnprocessableEntityError(
        "Password must be at least 6 characters long"
      );
    } else if (password.length > 20) {
      throw new UnprocessableEntityError(
        "Password must be a maximum of 20 characters"
      );
    }
  }

  constructor({ email, username, password }: CreateUserDto) {
    User.validateUsername(username);
    User.validateEmail(email);
    User.validatePassword(password);

    this.props = {
      id: uuid(),
      username,
      email,
      password,
      verified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
  }
}

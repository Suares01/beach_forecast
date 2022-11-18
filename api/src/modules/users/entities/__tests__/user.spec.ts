import { describe, it, expect } from "vitest";

import { CreateUserDto } from "../../dtos/createUser.dto";
import { User } from "../User";

describe("User Entity", () => {
  it("should create an user object", () => {
    const createUserDto: CreateUserDto = {
      username: "john_doe",
      email: "doe@mail.com",
      password: "Doe123456",
    };

    const user = new User(createUserDto);

    expect(user.id).toEqual(expect.any(String));
    expect(user.username).toBe(createUserDto.username);
    expect(user.email).toBe(createUserDto.email);
    expect(user.password).toBe(createUserDto.password);
    expect(user.verified).toBe(false);
    expect(user.createdAt).toEqual(expect.any(Date));
    expect(user.updatedAt).toEqual(expect.any(Date));
  });

  it("should throw an error if the username is invalid", () => {
    const invalidUsername1 = "john-doe";
    const invalidUsername2 = "JohnDoe";
    const invalidUsername3 = "jo";
    const invalidUsername4 = "John_doe$";
    const userDto = {
      email: "doe@mail.com",
      password: "Doe123456",
    };

    expect(
      () => new User({ username: invalidUsername1, ...userDto })
    ).toThrow();
    expect(
      () => new User({ username: invalidUsername2, ...userDto })
    ).toThrow();
    expect(
      () => new User({ username: invalidUsername3, ...userDto })
    ).toThrow();
    expect(
      () => new User({ username: invalidUsername4, ...userDto })
    ).toThrow();
  });

  it("should throw an error if the email is invalid", () => {
    const userDto: CreateUserDto = {
      username: "john_doe",
      email: "invalid_mail",
      password: "Doe123456",
    };

    expect(() => new User(userDto)).toThrow();
  });

  it("should throw an error if the password is invalid", () => {
    const veryShortPassword = "12345";
    const veryLongPassword = "123456789123456789123456789";
    const userDto = {
      username: "john_doe",
      email: "invalid@mail",
    };

    expect(
      () => new User({ password: veryLongPassword, ...userDto })
    ).toThrow();
    expect(
      () => new User({ password: veryShortPassword, ...userDto })
    ).toThrow();
  });
});

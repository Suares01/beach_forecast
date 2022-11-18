import "reflect-metadata";

import { describe, expect, it, vi } from "vitest";

import type { CreateUserDto } from "@modules/users/dtos/createUser.dto";
import { User } from "@modules/users/entities/User";
import type { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import type { IHash } from "@services/hash/IHash";
import type { IJsonWebToken } from "@services/JsonWebToken/IJsonWebToken";

import { SignInUseCase } from "../SignInUseCase";

describe("SignInUseCase", () => {
  const createUserDto: CreateUserDto = {
    username: "john_doe",
    email: "doe@mail.com",
    password: "123456Doe",
  };
  const { id, createdAt, email, password, updatedAt, username, verified } =
    new User(createUserDto);
  const defaultUser = {
    id,
    createdAt,
    email,
    password,
    updatedAt,
    username,
    verified,
  };

  const mockedUsersRepository: Partial<IUsersRepository> = {
    findOneWithPassword: vi.fn().mockResolvedValue(defaultUser),
  };
  const mockedHashService: IHash = {
    hash: vi.fn(),
    compare: vi.fn().mockResolvedValue(true),
  };
  const mockedJwtService: IJsonWebToken = {
    accessToken: {
      sign: vi.fn().mockReturnValue("access.token"),
      verify: vi.fn(),
    },
    refreshToken: {
      sign: vi.fn().mockReturnValue("refresh.token"),
      verify: vi.fn(),
    },
  };

  const signInUseCase = new SignInUseCase(
    mockedHashService,
    mockedJwtService,
    mockedUsersRepository as IUsersRepository
  );

  it("should return an accessToken and a refreshToken", async () => {
    const tokens = await signInUseCase.execute({
      email: defaultUser.email,
      password: defaultUser.password,
    });

    expect(tokens).toEqual({
      accessToken: expect.any(String),
      refreshToken: expect.any(String),
    });
    expect(mockedJwtService.accessToken.sign).toHaveBeenCalled();
    expect(mockedJwtService.refreshToken.sign).toHaveBeenCalled();
  });

  it("should throw an error if the email is incorrect", async () => {
    vi.spyOn(
      mockedUsersRepository,
      "findOneWithPassword"
    ).mockResolvedValueOnce(null);

    const tokens = signInUseCase.execute({
      email: defaultUser.email,
      password: defaultUser.password,
    });

    await expect(tokens).rejects.toThrow();
    expect(mockedHashService.compare).not.toHaveBeenCalled();
  });

  it("should throw an error if the password is incorrect", async () => {
    vi.spyOn(mockedHashService, "compare").mockResolvedValueOnce(false);

    const tokens = signInUseCase.execute({
      email: defaultUser.email,
      password: defaultUser.password,
    });

    await expect(tokens).rejects.toThrow();
    expect(mockedJwtService.accessToken.sign).not.toHaveBeenCalled();
    expect(mockedJwtService.refreshToken.sign).not.toHaveBeenCalled();
  });
});

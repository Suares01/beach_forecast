import "reflect-metadata";

import { describe, expect, it, vi } from "vitest";

import type { CreateUserDto } from "@modules/users/dtos/createUser.dto";
import { User } from "@modules/users/entities/User";
import type { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import type { IJsonWebToken } from "@services/JsonWebToken/IJsonWebToken";

import { RefreshTokenUseCase } from "../RefreshTokenUseCase";

describe("RefreshTokenUseCase", () => {
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
    findOne: vi.fn().mockResolvedValue(defaultUser),
  };
  const mockedJwtService: IJsonWebToken = {
    accessToken: {
      sign: vi.fn().mockReturnValue("new.access.token"),
      verify: vi.fn(),
    },
    refreshToken: {
      sign: vi.fn(),
      verify: vi.fn().mockReturnValue({ sub: defaultUser.id }),
    },
  };

  const refreshTokenUseCase = new RefreshTokenUseCase(
    mockedJwtService,
    mockedUsersRepository as IUsersRepository
  );

  it("should return a new access token", async () => {
    const { accessToken } = await refreshTokenUseCase.execute({
      refreshToken: "refreshToken",
    });

    expect(accessToken).toEqual(expect.any(String));
    expect(mockedJwtService.accessToken.sign).toHaveBeenCalled();
  });

  it("should throw an error if refresh token is invalid", async () => {
    vi.spyOn(mockedJwtService.refreshToken, "verify").mockImplementationOnce(
      () => {
        throw new Error("invalid refresh token");
      }
    );

    const accessToken = refreshTokenUseCase.execute({
      refreshToken: "refreshToken",
    });

    await expect(accessToken).rejects.toThrow();
    expect(mockedUsersRepository.findOne).not.toHaveBeenCalled();
  });

  it("should throw an error if refresh token is invalid", async () => {
    vi.spyOn(mockedUsersRepository, "findOne").mockResolvedValueOnce(null);

    const accessToken = refreshTokenUseCase.execute({
      refreshToken: "refreshToken",
    });

    await expect(accessToken).rejects.toThrow();
    expect(mockedJwtService.accessToken.sign).not.toHaveBeenCalled();
  });
});

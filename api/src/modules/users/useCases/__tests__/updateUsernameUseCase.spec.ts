import "reflect-metadata";

import { it, vi, describe, expect } from "vitest";

import type { CreateUserDto } from "@modules/users/dtos/createUser.dto";
import { User, UserData } from "@modules/users/entities/User";
import type { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

import { UpdateUsernameUseCase } from "../UpdateUsernameUseCase";

describe("UpdateUsernameUseCase", () => {
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
  const updatedUsername = {
    ...defaultUser,
    username: "john_doe10",
  };

  const mockedUsersRepository: Partial<IUsersRepository> = {
    findOne: vi
      .fn()
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce({ ...defaultUser, password: undefined }),
    updateUsername: vi
      .fn()
      .mockResolvedValue({ ...updatedUsername, password: undefined }),
  };
  const updateUsernameUseCase = new UpdateUsernameUseCase(
    mockedUsersRepository as IUsersRepository
  );

  it("should return a user with the new username successfully", async () => {
    const updatedUser = await updateUsernameUseCase.execute({
      newUsername: updatedUsername.username,
      id: defaultUser.id,
    });

    const { createdAt, email, id, username, updatedAt, verified } =
      updatedUsername;
    expect(updatedUser).toEqual<UserData>({
      id,
      createdAt,
      email,
      username,
      updatedAt,
      verified,
    });
    expect(updatedUser.username).not.toBe(defaultUser.username);
  });

  it("should throw an error if the username is invalid", async () => {
    const invalidUsername = "$John-Doe$";

    const updatedUser = updateUsernameUseCase.execute({
      id: defaultUser.id,
      newUsername: invalidUsername,
    });

    await expect(updatedUser).rejects.toThrow();
    expect(mockedUsersRepository.findOne).not.toHaveBeenCalled();
  });

  it("should throw an error if the new username already exist", async () => {
    vi.spyOn(mockedUsersRepository, "findOne").mockResolvedValueOnce(
      defaultUser
    );

    const updatedUser = updateUsernameUseCase.execute({
      id: defaultUser.id,
      newUsername: updatedUsername.username,
    });

    await expect(updatedUser).rejects.toThrow();
    expect(mockedUsersRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if the user is not found", async () => {
    vi.spyOn(mockedUsersRepository, "findOne")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(null);

    const updatedUser = updateUsernameUseCase.execute({
      id: defaultUser.id,
      newUsername: updatedUsername.username,
    });

    await expect(updatedUser).rejects.toThrow();
  });
});

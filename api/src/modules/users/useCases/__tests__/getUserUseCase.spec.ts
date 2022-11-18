import "reflect-metadata";

import { expect, describe, it, vi } from "vitest";

import type { CreateUserDto } from "@modules/users/dtos/createUser.dto";
import { User, type UserData } from "@modules/users/entities/User";
import type { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

import { GetUserUseCase } from "../GetUserUseCase";

describe("GetUserUseCase", () => {
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
    findOne: vi.fn().mockResolvedValue({ ...defaultUser, password: undefined }),
  };

  const getUserUseCase = new GetUserUseCase(
    mockedUsersRepository as IUsersRepository
  );

  it("should successfully return a user by id", async () => {
    const user = await getUserUseCase.execute({ id: defaultUser.id });

    const { id, createdAt, email, username, updatedAt, verified } = defaultUser;
    expect(user).toEqual<UserData>({
      id,
      createdAt,
      email,
      username,
      updatedAt,
      verified,
    });
    expect(mockedUsersRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockedUsersRepository.findOne).toHaveBeenCalledWith({
      id: defaultUser.id,
    });
  });

  it("should successfully return a user by email", async () => {
    const user = await getUserUseCase.execute({ email: defaultUser.email });

    const { id, createdAt, email, username, updatedAt, verified } = defaultUser;
    expect(user).toEqual<UserData>({
      id,
      createdAt,
      email,
      username,
      updatedAt,
      verified,
    });
    expect(mockedUsersRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockedUsersRepository.findOne).toHaveBeenCalledWith({
      email: defaultUser.email,
    });
  });

  it("should successfully return a user by username", async () => {
    const user = await getUserUseCase.execute({
      username: defaultUser.username,
    });

    const { id, createdAt, email, username, updatedAt, verified } = defaultUser;
    expect(user).toEqual<UserData>({
      id,
      createdAt,
      email,
      username,
      updatedAt,
      verified,
    });
    expect(mockedUsersRepository.findOne).toHaveBeenCalledTimes(1);
    expect(mockedUsersRepository.findOne).toHaveBeenCalledWith({
      username: defaultUser.username,
    });
  });

  it("should throw an error if the user is not found", async () => {
    vi.spyOn(mockedUsersRepository, "findOne").mockResolvedValueOnce(null);

    const user = getUserUseCase.execute({ email: defaultUser.email });

    await expect(user).rejects.toThrow();
  });
});

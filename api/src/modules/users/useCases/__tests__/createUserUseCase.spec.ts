import "reflect-metadata";

import { describe, it, vi, expect } from "vitest";

import type { CreateUserDto } from "@modules/users/dtos/createUser.dto";
import { User, type UserData } from "@modules/users/entities/User";
import type { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import type { IHash } from "@services/hash/IHash";

import { CreateUserUseCase } from "../CreateUserUseCase";

describe("CreateUserUseCase", () => {
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
    create: vi.fn().mockResolvedValue({ ...defaultUser, password: undefined }),
    findOne: vi.fn().mockResolvedValue(null),
  };
  const mockedHashService: Partial<IHash> = {
    hash: vi.fn().mockResolvedValue("passwordHash"),
  };
  const createUserUseCase = new CreateUserUseCase(
    mockedUsersRepository as IUsersRepository,
    mockedHashService as IHash
  );

  it("should be able to create a user with success", async () => {
    const user = await createUserUseCase.execute(createUserDto);

    expect(user).toEqual<UserData>({
      id: defaultUser.id,
      email: defaultUser.email,
      verified: defaultUser.verified,
      createdAt: defaultUser.createdAt,
      username: defaultUser.username,
      updatedAt: defaultUser.updatedAt,
    });
    expect(mockedHashService.hash).toHaveBeenCalled();
    expect(mockedUsersRepository.create).toHaveBeenCalled();
  });

  it("should throw an error if the email, username or password is incorrect", async () => {
    const throwIncorrectPassword = createUserUseCase.execute({
      ...createUserDto,
      password: "doe12",
    });
    const throwIncorrectEmail = createUserUseCase.execute({
      ...createUserDto,
      email: "incorrectEmail",
    });
    const throwIncorrectUsername = createUserUseCase.execute({
      ...createUserDto,
      username: "Incorrect Username",
    });

    await expect(throwIncorrectPassword).rejects.toThrow();
    await expect(throwIncorrectEmail).rejects.toThrow();
    await expect(throwIncorrectUsername).rejects.toThrow();
  });

  it("should throw an error if the email is already registered", async () => {
    vi.spyOn(mockedUsersRepository, "findOne").mockResolvedValueOnce(
      defaultUser
    );

    const user = createUserUseCase.execute(createUserDto);

    await expect(user).rejects.toThrow();
    expect(mockedUsersRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it("should throw an error if the username is already registered", async () => {
    vi.spyOn(mockedUsersRepository, "findOne")
      .mockResolvedValueOnce(null)
      .mockResolvedValueOnce(defaultUser);

    const user = createUserUseCase.execute(createUserDto);

    await expect(user).rejects.toThrow();
    expect(mockedUsersRepository.findOne).toHaveBeenCalledTimes(2);
    expect(mockedHashService.hash).not.toHaveBeenCalled();
    expect(mockedUsersRepository.create).not.toHaveBeenCalled();
  });
});

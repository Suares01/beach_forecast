import "reflect-metadata";

import { describe, expect, it, vi } from "vitest";

import type { CreateUserDto } from "@modules/users/dtos/createUser.dto";
import { type IUser, User, UserData } from "@modules/users/entities/User";
import type { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import type { IHash } from "@services/hash/IHash";

import { UpdatePasswordUseCase } from "../UpdatePasswordUseCase";

describe("UpdatePasswordUseCase", () => {
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
  const updatedPassword: IUser = {
    ...defaultUser,
    password: "Doe123456",
  };

  const mockedUsersRepository: Partial<IUsersRepository> = {
    findOneWithPassword: vi.fn().mockResolvedValue(defaultUser),
    updatePassword: vi
      .fn()
      .mockResolvedValue({ ...updatedPassword, password: undefined }),
  };
  const mockedHashService: IHash = {
    hash: vi.fn().mockResolvedValue("newPasswordHash"),
    compare: vi.fn().mockResolvedValue(true),
  };
  const updatePasswordUseCase = new UpdatePasswordUseCase(
    mockedUsersRepository as IUsersRepository,
    mockedHashService
  );

  it("should return a user and update his password successfully", async () => {
    const { id, email, username, createdAt, updatedAt, verified } =
      updatedPassword;

    const user = await updatePasswordUseCase.execute({
      id: defaultUser.id,
      currentPassword: defaultUser.password,
      newPassword: updatedPassword.password,
    });

    expect(user).toEqual<UserData>({
      id,
      email,
      username,
      createdAt,
      updatedAt,
      verified,
    });
    expect(mockedHashService.hash).toHaveBeenCalled();
    expect(mockedUsersRepository.updatePassword).toHaveBeenCalled();
  });

  it("should throw an error if the new password is invalid", async () => {
    const invalidPassword = "12345";

    const user = updatePasswordUseCase.execute({
      id: defaultUser.id,
      currentPassword: defaultUser.password,
      newPassword: invalidPassword,
    });

    await expect(user).rejects.toThrow();
    expect(mockedUsersRepository.findOneWithPassword).not.toHaveBeenCalled();
  });

  it("should throw an error if the user does not exist", async () => {
    vi.spyOn(
      mockedUsersRepository,
      "findOneWithPassword"
    ).mockResolvedValueOnce(null);

    const user = updatePasswordUseCase.execute({
      id: defaultUser.id,
      currentPassword: defaultUser.password,
      newPassword: "Doe123456",
    });

    await expect(user).rejects.toThrow();
    expect(mockedHashService.compare).not.toHaveBeenCalled();
  });

  it("should throw an error if the current password is incorrect", async () => {
    vi.spyOn(mockedHashService, "compare").mockResolvedValueOnce(false);

    const user = updatePasswordUseCase.execute({
      id: defaultUser.id,
      currentPassword: defaultUser.password,
      newPassword: "Doe123456",
    });

    await expect(user).rejects.toThrow();
    expect(mockedHashService.hash).not.toHaveBeenCalled();
  });
});

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { container } from "tsyringe";

// import { APIError } from "@core/errors/ApiError";
import { APIError } from "@core/errors/ApiError";
import { CreateUserDto } from "@modules/users/dtos/createUser.dto";
import { CreateUserUseCase } from "@modules/users/useCases/CreateUserUseCase";
import { DeleteUserUseCase } from "@modules/users/useCases/DeleteUserUseCase";
import { GetUserUseCase } from "@modules/users/useCases/GetUserUseCase";
import { UpdatePasswordUseCase } from "@modules/users/useCases/UpdatePasswordUseCase";
import { UpdateUsernameUseCase } from "@modules/users/useCases/UpdateUsernameUseCase";

export class ExpressUsersController {
  async create(req: Request, res: Response): Promise<Response> {
    const errors = validationResult(req);

    if (!errors.isEmpty()) return res.status(400).json(errors.array());

    const { email, password, username } = req.body as CreateUserDto;

    const createUserUseCase = container.resolve(CreateUserUseCase);

    const user = await createUserUseCase.execute({ email, password, username });

    return res.status(201).json(user);
  }

  async me(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;

    const getUserUseCase = container.resolve(GetUserUseCase);

    const user = await getUserUseCase.execute({ id });

    return res.status(200).json(user);
  }

  async updateUsername(req: Request, res: Response): Promise<Response> {
    const { newUsername } = req.body;
    const { id } = req.user;

    const updateUsernameUseCase = container.resolve(UpdateUsernameUseCase);

    const user = await updateUsernameUseCase.execute({ id, newUsername });

    return res.status(200).json(user);
  }

  async updatePassword(req: Request, res: Response): Promise<Response> {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user;

    const updatePasswordUseCase = container.resolve(UpdatePasswordUseCase);

    await updatePasswordUseCase.execute({
      id,
      currentPassword,
      newPassword,
    });

    return res.status(204).send();
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const password = req.headers.password as string | undefined;
    const { id } = req.user;

    if (!password)
      return res.status(400).json(
        APIError.format({
          message: "password is missing",
          code: 400,
        })
      );

    const deleteUserUseCase = container.resolve(DeleteUserUseCase);

    await deleteUserUseCase.execute({
      id,
      password,
    });

    return res.status(204).send();
  }
}

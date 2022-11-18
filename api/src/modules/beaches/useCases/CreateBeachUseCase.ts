import { inject, injectable } from "tsyringe";

import { ConflictError } from "@core/errors/ConflictError";
import { NotFoundError } from "@core/errors/NotFoundError";
import type { UseCase } from "@core/UseCase";
import type { IUsersRepository } from "@modules/users/repositories/IUsersRepository";

import type { CreateBeachDto } from "../dtos/createBeach.dto";
import { Beach, type IBeach } from "../entities/Beach";
import type { IBeachesRepository } from "../repositories/IBeachesRepository";

type Request = CreateBeachDto;

type Response = IBeach;

@injectable()
export class CreateBeachUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("BeachesRepository")
    private readonly beachesRepository: IBeachesRepository,
    @inject("UsersRepository")
    private readonly usersRepository: IUsersRepository
  ) {}

  async execute({
    lat,
    lng,
    name,
    position,
    userId,
  }: CreateBeachDto): Promise<Response> {
    const beachEntity = new Beach({ lat, lng, name, position, userId }).props;

    const user = await this.usersRepository.findOne({ id: userId });

    if (!user) throw new NotFoundError("user not found");

    const userBeachByName = await this.beachesRepository.findByName(userId, {
      name,
    });

    if (userBeachByName)
      throw new ConflictError(
        "a beach with the same name has already been registered"
      );

    const userBeachByLatLng = await this.beachesRepository.findByLatLng(
      userId,
      { lat, lng }
    );

    if (userBeachByLatLng)
      throw new ConflictError(
        "a beach with the same lat and lng has already been registered"
      );

    const beach = await this.beachesRepository.create(beachEntity);

    return beach;
  }
}

import { inject, injectable } from "tsyringe";

import { NotFoundError } from "@core/errors/NotFoundError";
import type { UseCase } from "@core/UseCase";

import type { UpdateBeachDto } from "../dtos/updateBeach.dto";
import type { IBeach } from "../entities/Beach";
import type { IBeachesRepository } from "../repositories/IBeachesRepository";

type Request = UpdateBeachDto & { beachId: string };

type Response = IBeach;

@injectable()
export class UpdateBeachUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("BeachesRepository")
    private readonly beachesRepository: IBeachesRepository
  ) {}

  async execute({
    lat,
    lng,
    name,
    position,
    beachId,
  }: Request): Promise<Response> {
    const beach = await this.beachesRepository.findById(beachId);

    if (!beach) throw new NotFoundError("beach not found");

    const updatedBeach = await this.beachesRepository.update(beachId, {
      lat,
      lng,
      name,
      position,
    });

    return updatedBeach;
  }
}

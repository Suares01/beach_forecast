import { inject, injectable } from "tsyringe";

import { NotFoundError } from "@core/errors/NotFoundError";
import type { UseCase } from "@core/UseCase";

import type { IBeach } from "../entities/Beach";
import type { IBeachesRepository } from "../repositories/IBeachesRepository";

type Request = Pick<IBeach, "id">;

type Response = IBeach;

@injectable()
export class DeleteBeachUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("BeachesRepository")
    private readonly beachesRepository: IBeachesRepository
  ) {}

  async execute({ id }: Request): Promise<Response> {
    const beach = await this.beachesRepository.findById(id);

    if (!beach) throw new NotFoundError("beach not found");

    const deletedBeach = await this.beachesRepository.delete(id);

    return deletedBeach;
  }
}

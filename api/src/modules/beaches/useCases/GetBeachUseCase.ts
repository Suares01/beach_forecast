import { inject, injectable } from "tsyringe";

import { NotFoundError } from "@core/errors/NotFoundError";
import type { UseCase } from "@core/UseCase";

import type { GetBeachDto } from "../dtos/getBeach.dto";
import type { IBeach } from "../entities/Beach";
import type { IBeachesRepository } from "../repositories/IBeachesRepository";

type Request = GetBeachDto;

type Response = IBeach;

@injectable()
export class GetBeachUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("BeachesRepository")
    private readonly beachesRepository: IBeachesRepository
  ) {}

  async execute({ id, name, userId }: Request): Promise<Response> {
    let beach: IBeach | null = null;

    if (id) {
      beach = await this.beachesRepository.findById(id);
    } else if (name) {
      beach = await this.beachesRepository.findByName(userId, { name });
    }

    if (!beach) throw new NotFoundError("beach not found");

    return beach;
  }
}

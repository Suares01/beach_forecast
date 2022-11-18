import { inject, injectable } from "tsyringe";

import type { UseCase } from "@core/UseCase";

import type { IBeach } from "../entities/Beach";
import type { IBeachesRepository } from "../repositories/IBeachesRepository";

type Request = {
  userId: string;
};

type Response = IBeach[];

@injectable()
export class GetAllBeachesUseCase implements UseCase<Request, Response> {
  constructor(
    @inject("BeachesRepository")
    private readonly beachesRepository: IBeachesRepository
  ) {}

  async execute({ userId }: Request): Promise<Response> {
    const beaches = await this.beachesRepository.findAll(userId);

    return beaches;
  }
}

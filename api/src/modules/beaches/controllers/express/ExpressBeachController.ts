import { Request, Response } from "express";
import { container } from "tsyringe";

import { CreateBeachUseCase } from "@modules/beaches/useCases/CreateBeachUseCase";
import { DeleteBeachUseCase } from "@modules/beaches/useCases/DeleteBeachUseCase";
import { GetAllBeachesUseCase } from "@modules/beaches/useCases/GetAllBeachesUseCase";
import { GetBeachUseCase } from "@modules/beaches/useCases/GetBeachUseCase";
import { UpdateBeachUseCase } from "@modules/beaches/useCases/UpdateBeachUseCase";

export class ExpressBeachController {
  async create(req: Request, res: Response): Promise<Response> {
    const { lat, lng, name, position } = req.body;
    const { id } = req.user;

    const createBeachUseCase = container.resolve(CreateBeachUseCase);

    const beach = await createBeachUseCase.execute({
      lat,
      lng,
      name,
      position,
      userId: id,
    });

    return res.status(201).json(beach);
  }

  async getBeach(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;
    const { id: userId } = req.user;

    const getBeachUseCase = container.resolve(GetBeachUseCase);

    const beach = await getBeachUseCase.execute({ id, userId });

    return res.status(200).json(beach);
  }

  async getAllBeaches(req: Request, res: Response): Promise<Response> {
    const { id } = req.user;

    const getAllBeachesUseCase = container.resolve(GetAllBeachesUseCase);

    const beaches = await getAllBeachesUseCase.execute({ userId: id });

    return res.status(200).json(beaches);
  }

  async updateBeach(req: Request, res: Response): Promise<Response> {
    const { lat, lng, name, position } = req.body;
    const { id } = req.params;

    const updateBeachUseCase = container.resolve(UpdateBeachUseCase);

    const beaches = await updateBeachUseCase.execute({
      lat,
      lng,
      name,
      position,
      beachId: id,
    });

    return res.status(200).json(beaches);
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const { id } = req.params;

    const deleteBeachUseCase = container.resolve(DeleteBeachUseCase);

    await deleteBeachUseCase.execute({
      id,
    });

    return res.status(204).send();
  }
}

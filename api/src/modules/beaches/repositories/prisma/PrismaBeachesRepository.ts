import { CreateBeachDto } from "@modules/beaches/dtos/createBeach.dto";
import { IBeach } from "@modules/beaches/entities/Beach";
import { Beach } from "@prisma/client";

import { prisma } from "../../../../database/prisma";
import {
  FindByLatLng,
  FindByName,
  IBeachesRepository,
} from "../IBeachesRepository";

export class PrismaBeachesRepository implements IBeachesRepository {
  private model = prisma.beach;

  private formatBeachObject(prismaBeach: Beach | null): IBeach | null {
    if (!prismaBeach) return null;

    return {
      id: prismaBeach.id,
      lat: prismaBeach.lat.toNumber(),
      lng: prismaBeach.lng.toNumber(),
      name: prismaBeach.name,
      position: prismaBeach.position,
      userId: prismaBeach.userId,
    };
  }

  async create(data: IBeach): Promise<IBeach> {
    const beach = await this.model.create({
      data,
    });

    return this.formatBeachObject(beach) as IBeach;
  }

  async findByName(userId: string, data: FindByName): Promise<IBeach | null> {
    const beach = await this.model.findFirst({
      where: {
        AND: [
          {
            userId,
          },
          {
            name: data.name,
          },
        ],
      },
    });

    return this.formatBeachObject(beach);
  }

  async findById(id: string): Promise<IBeach | null> {
    const beach = await this.model.findUnique({
      where: {
        id,
      },
    });

    return this.formatBeachObject(beach);
  }

  async findByLatLng(
    userId: string,
    data: FindByLatLng
  ): Promise<IBeach | null> {
    const beach = await this.model.findFirst({
      where: {
        AND: [
          {
            userId,
          },
          {
            lat: data.lat,
          },
          {
            lng: data.lng,
          },
        ],
      },
    });

    return this.formatBeachObject(beach);
  }

  async findAll(userId: string): Promise<IBeach[]> {
    const beaches = await this.model.findMany({
      where: {
        userId,
      },
    });

    return beaches.map((beach) => this.formatBeachObject(beach) as IBeach);
  }

  async update(
    id: string,
    data: Partial<Omit<CreateBeachDto, "userId">>
  ): Promise<IBeach> {
    const beach = await this.model.update({
      where: {
        id,
      },
      data,
    });

    return this.formatBeachObject(beach) as IBeach;
  }

  async delete(id: string): Promise<IBeach> {
    const beach = await this.model.delete({
      where: {
        id,
      },
    });

    return this.formatBeachObject(beach) as IBeach;
  }

  async deleteMany(userId: string): Promise<number> {
    const beaches = await this.model.deleteMany({
      where: {
        userId,
      },
    });

    return beaches.count;
  }
}

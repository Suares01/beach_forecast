import { FindOtpDto } from "@modules/auth/dtos/findOtpDto.dto";
import { UpdateOtpDto } from "@modules/auth/dtos/updateOtpDto";
import { IOtp } from "@modules/auth/models/Otp";

import { prisma } from "../../../../database/prisma";
import { IOtpRepository } from "../IOtpRepository";

export class PrismaOtpRepository implements IOtpRepository {
  private model = prisma.oTP;

  public create({
    expiresIn,
    id,
    isAlreadyUsed,
    otp,
    userId,
  }: IOtp): Promise<IOtp> {
    return this.model.create({
      data: {
        id,
        otp,
        expiresIn,
        isAlreadyUsed,
        userId,
      },
    });
  }

  public findOne({ id, userId }: FindOtpDto): Promise<IOtp | null> {
    return this.model.findUnique({
      where: {
        id,
        userId,
      },
    });
  }

  public setAsUsed(userId: string): Promise<IOtp> {
    return this.model.update({
      data: {
        isAlreadyUsed: true,
      },
      where: {
        userId,
      },
    });
  }

  public updateToken(
    userId: string,
    { expiresIn, otp }: UpdateOtpDto
  ): Promise<IOtp> {
    return this.model.update({
      where: {
        userId,
      },
      data: {
        expiresIn,
        isAlreadyUsed: false,
        otp,
      },
    });
  }
}

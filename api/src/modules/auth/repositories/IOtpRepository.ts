import { FindOtpDto } from "../dtos/findOtpDto.dto";
import { UpdateOtpDto } from "../dtos/updateOtpDto";
import { IOtp } from "../models/Otp";

export interface IOtpRepository {
  create(data: IOtp): Promise<IOtp>;
  findOne(data: FindOtpDto): Promise<IOtp | null>;
  setAsUsed(userId: string): Promise<IOtp>;
  updateToken(userId: string, data: UpdateOtpDto): Promise<IOtp>;
}

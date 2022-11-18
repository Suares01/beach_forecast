import { addMinutes } from "date-fns";
import crypto from "node:crypto";
import { v4 as uudiV4 } from "uuid";

export interface IOtp {
  id: string;
  otp: number;
  expiresIn: Date;
  isAlreadyUsed: boolean;
  userId: string;
}

export class Otp {
  private readonly props: IOtp;

  get id(): string {
    return this.props.id;
  }
  get otp(): number {
    return this.props.otp;
  }

  get expiresIn(): Date {
    return this.props.expiresIn;
  }

  get isAlreadyUsed(): boolean {
    return this.props.isAlreadyUsed;
  }

  get userId(): string {
    return this.props.userId;
  }

  private generateOtp(): number {
    let otp = "";

    while (otp.length < 4) {
      if (otp.length === 0) {
        otp += crypto.randomInt(1, 9);
      } else {
        otp += crypto.randomInt(0, 9);
      }
    }

    return Number(otp);
  }

  public constructor(userId: string) {
    this.props = {
      id: uudiV4(),
      otp: this.generateOtp(),
      userId,
      expiresIn: addMinutes(new Date(), 5),
      isAlreadyUsed: false,
    };
  }
}

import crypto from "node:crypto";
import { describe, expect, it } from "vitest";

import { Otp } from "../Otp";

describe("OTP Entity", () => {
  it("should create a new OTP", async () => {
    const userId = crypto.randomUUID();

    const otp = new Otp(userId);

    expect(otp.id).toEqual(expect.any(String));
    expect(otp.otp).toEqual(expect.any(Number));
    expect(otp.isAlreadyUsed).toBe(false);
    expect(otp.expiresIn).toEqual(expect.any(Date));
    expect(otp.userId).toBe(userId);
  });
});

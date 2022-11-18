import * as bcrypt from "bcrypt";

import { IHash } from "../IHash";

export class BcryptHash implements IHash {
  async hash(data: string, rounds = 10): Promise<string> {
    const salt = await bcrypt.genSalt(rounds);

    return await bcrypt.hash(data, salt);
  }

  compare(data: string, encrypted: string): Promise<boolean> {
    return bcrypt.compare(data, encrypted);
  }
}

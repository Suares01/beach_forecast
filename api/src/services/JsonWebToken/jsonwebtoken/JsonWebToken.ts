import jwt from "jsonwebtoken";

import type {
  AccessTokenPayload,
  IJsonWebToken,
  RefreshTokenPayload,
} from "../IJsonWebToken";

class AccessToken {
  private readonly secret: string = process.env.ACCESS_TOKEN_SECRET as string;

  sign({ username, email, sub }: AccessTokenPayload): string {
    return jwt.sign({ username, email }, this.secret, {
      subject: sub,
      expiresIn: "1h",
      audience: "api-url",
      issuer: "BeachForecast.API",
      algorithm: "HS256",
      header: {
        alg: "HS256",
        typ: "at-JWT",
      },
    });
  }

  verify(token: string): AccessTokenPayload {
    const { email, username, sub } = jwt.verify(token, this.secret, {
      audience: "api-url",
      issuer: "BeachForecast.API",
    }) as AccessTokenPayload;

    return { email, username, sub };
  }
}

class RefreshToken {
  private readonly secret: string = process.env.REFRESH_TOKEN_SECRET as string;

  sign({ sub }: RefreshTokenPayload): string {
    return jwt.sign({}, this.secret, {
      subject: sub,
      expiresIn: "7d",
      audience: "api-url",
      issuer: "BeachForecast.API",
      algorithm: "HS256",
      header: {
        alg: "HS256",
        typ: "rt-JWT",
      },
    });
  }

  verify(token: string): RefreshTokenPayload {
    const { sub } = jwt.verify(token, this.secret, {
      audience: "api-url",
      issuer: "BeachForecast.API",
    }) as RefreshTokenPayload;

    return { sub };
  }
}

export class JsonWebToken implements IJsonWebToken {
  public accessToken;

  public refreshToken;

  constructor() {
    this.accessToken = new AccessToken();
    this.refreshToken = new RefreshToken();
  }
}

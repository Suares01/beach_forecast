interface TokenPayload {
  sub: string;
}

export interface AccessTokenPayload extends TokenPayload {
  email: string;
  username: string;
}

export type RefreshTokenPayload = TokenPayload;

export interface IJsonWebToken {
  accessToken: {
    sign(payload: AccessTokenPayload): string;
    verify(token: string): AccessTokenPayload;
  };
  refreshToken: {
    sign(payload: RefreshTokenPayload): string;
    verify(token: string): RefreshTokenPayload;
  };
}

import { container } from "tsyringe";

import type { IOtpRepository } from "@modules/auth/repositories/IOtpRepository";
import { PrismaOtpRepository } from "@modules/auth/repositories/prisma/PrismaOtpRepository";
import type { IBeachesRepository } from "@modules/beaches/repositories/IBeachesRepository";
import { PrismaBeachesRepository } from "@modules/beaches/repositories/prisma/PrismaBeachesRepository";
import { Rating } from "@modules/forecasts/services/Rating";
import type { IUsersRepository } from "@modules/users/repositories/IUsersRepository";
import { PrismaUsersRepository } from "@modules/users/repositories/prisma/PrismaUsersRepository";
import type { ICacheService } from "@services/cacheService/ICacheService";
import { CacheRedisService } from "@services/cacheService/redis/CacheRedisService";
import type { IEmailService } from "@services/emailService/IEmailService";
import { NodemailerEmailService } from "@services/emailService/nodemailer/NodemailerEmailService";
import { BcryptHash } from "@services/hash/bcrypt/BcryptHash";
import type { IHash } from "@services/hash/IHash";
import type { IJsonWebToken } from "@services/JsonWebToken/IJsonWebToken";
import { JsonWebToken } from "@services/JsonWebToken/jsonwebtoken/JsonWebToken";

// services
container.register<ICacheService>("CacheService", {
  useClass: CacheRedisService,
});
container.register<IHash>("Hash", { useClass: BcryptHash });
container.register<IJsonWebToken>("JsonWebToken", { useClass: JsonWebToken });
container.register<typeof Rating>("ForecastRating", { useValue: Rating });
container.register<IEmailService>("EmailService", {
  useClass: NodemailerEmailService,
});

// repositories
container.registerSingleton<IUsersRepository>(
  "UsersRepository",
  PrismaUsersRepository
);
container.registerSingleton<IBeachesRepository>(
  "BeachesRepository",
  PrismaBeachesRepository
);
container.registerSingleton<IOtpRepository>(
  "OtpRepository",
  PrismaOtpRepository
);

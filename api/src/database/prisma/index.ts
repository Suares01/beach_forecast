import logger from "@core/loggers/winston/logger";
import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient({
  log: ["info"],
});

export const connect = async (): Promise<void> => {
  await prisma.$connect();
  logger.info("database connected");
};

export const disconnect = async (): Promise<void> => {
  await prisma.$disconnect();
  logger.info("database disconnected");
};

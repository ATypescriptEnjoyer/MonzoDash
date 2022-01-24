-- CreateEnum
CREATE TYPE "AUTH_KEY_TYPE" AS ENUM ('AUTH', 'REFRESH');

-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "type" "AUTH_KEY_TYPE" NOT NULL,
    "value" TEXT NOT NULL,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

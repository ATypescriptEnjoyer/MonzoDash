-- CreateTable
CREATE TABLE "Auth" (
    "id" SERIAL NOT NULL,
    "authToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "twoFactored" BOOLEAN NOT NULL DEFAULT false,
    "expiresIn" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Auth_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Settings" (
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Auth_authToken_key" ON "Auth"("authToken");

-- CreateIndex
CREATE UNIQUE INDEX "Auth_refreshToken_key" ON "Auth"("refreshToken");

-- CreateIndex
CREATE UNIQUE INDEX "Settings_name_key" ON "Settings"("name");

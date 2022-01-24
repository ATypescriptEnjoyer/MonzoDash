/*
  Warnings:

  - You are about to drop the column `type` on the `Auth` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `Auth` table. All the data in the column will be lost.
  - Added the required column `authToken` to the `Auth` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `Auth` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Auth" DROP COLUMN "type",
DROP COLUMN "value",
ADD COLUMN     "authToken" TEXT NOT NULL,
ADD COLUMN     "refreshToken" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AUTH_KEY_TYPE";

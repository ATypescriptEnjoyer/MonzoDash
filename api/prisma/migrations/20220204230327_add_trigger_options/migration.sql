/*
  Warnings:

  - You are about to drop the column `key` on the `Trigger` table. All the data in the column will be lost.
  - Added the required column `triggerOptionId` to the `Trigger` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Trigger" DROP COLUMN "key",
ADD COLUMN     "triggerOptionId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "TriggerOption" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,

    CONSTRAINT "TriggerOption_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_triggerOptionId_fkey" FOREIGN KEY ("triggerOptionId") REFERENCES "TriggerOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

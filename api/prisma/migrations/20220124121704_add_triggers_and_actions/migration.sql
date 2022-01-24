-- CreateEnum
CREATE TYPE "TRIGGER_OPERATOR" AS ENUM ('EQUALS', 'NOT_EQUALS');

-- CreateTable
CREATE TABLE "AutomationRecord" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "AutomationRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trigger" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "operator" "TRIGGER_OPERATOR" NOT NULL,
    "value" TEXT NOT NULL,
    "automationRecordId" INTEGER,

    CONSTRAINT "Trigger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Action" (
    "id" SERIAL NOT NULL,
    "action" JSONB NOT NULL,
    "automationRecordId" INTEGER,

    CONSTRAINT "Action_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_automationRecordId_fkey" FOREIGN KEY ("automationRecordId") REFERENCES "AutomationRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_automationRecordId_fkey" FOREIGN KEY ("automationRecordId") REFERENCES "AutomationRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

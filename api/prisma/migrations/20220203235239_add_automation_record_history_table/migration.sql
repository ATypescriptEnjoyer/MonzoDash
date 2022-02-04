-- CreateTable
CREATE TABLE "AutomationRecordHistory" (
    "id" SERIAL NOT NULL,
    "automationRecordId" INTEGER,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AutomationRecordHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AutomationRecordHistory" ADD CONSTRAINT "AutomationRecordHistory_automationRecordId_fkey" FOREIGN KEY ("automationRecordId") REFERENCES "AutomationRecord"("id") ON DELETE SET NULL ON UPDATE CASCADE;

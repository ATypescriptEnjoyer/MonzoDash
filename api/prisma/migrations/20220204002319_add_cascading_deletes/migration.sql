-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_automationRecordId_fkey";

-- DropForeignKey
ALTER TABLE "AutomationRecordHistory" DROP CONSTRAINT "AutomationRecordHistory_automationRecordId_fkey";

-- DropForeignKey
ALTER TABLE "Trigger" DROP CONSTRAINT "Trigger_automationRecordId_fkey";

-- AddForeignKey
ALTER TABLE "AutomationRecordHistory" ADD CONSTRAINT "AutomationRecordHistory_automationRecordId_fkey" FOREIGN KEY ("automationRecordId") REFERENCES "AutomationRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trigger" ADD CONSTRAINT "Trigger_automationRecordId_fkey" FOREIGN KEY ("automationRecordId") REFERENCES "AutomationRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Action" ADD CONSTRAINT "Action_automationRecordId_fkey" FOREIGN KEY ("automationRecordId") REFERENCES "AutomationRecord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

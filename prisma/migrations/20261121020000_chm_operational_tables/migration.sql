-- CHM-SFD operational tables missing from the preview database.
-- Additive migration: preserves all existing authentication and reference data.

CREATE TABLE IF NOT EXISTS public."ComplaintOperation" (
  "id" TEXT NOT NULL,
  "operationNumber" TEXT NOT NULL,
  "type" TEXT NOT NULL DEFAULT 'شكوى',
  "status" TEXT NOT NULL DEFAULT 'NEW',
  "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
  "channel" TEXT NOT NULL DEFAULT 'WEB',
  "applicantName" TEXT NOT NULL,
  "gender" TEXT NOT NULL DEFAULT '',
  "phone" TEXT NOT NULL DEFAULT '',
  "secondaryPhone" TEXT,
  "citizenEmail" TEXT,
  "location" TEXT,
  "applicantRole" TEXT,
  "defendant" TEXT,
  "governorate" TEXT,
  "directorate" TEXT,
  "subDistrict" TEXT,
  "villageOrNeighborhood" TEXT,
  "subject" TEXT NOT NULL,
  "description" TEXT NOT NULL,
  "attachmentUrl" TEXT,
  "sensitivity" TEXT,
  "primaryCategory" TEXT,
  "subCategory" TEXT,
  "secondSubCategory" TEXT,
  "projectNumber" TEXT,
  "projectName" TEXT,
  "boxMinuteId" TEXT,
  "assignedTo" TEXT,
  "assignedToId" TEXT,
  "internalNotes" TEXT,
  "dueDate" TIMESTAMP(3),
  "finalResponse" TEXT,
  "responseChannels" TEXT,
  "finalEvaluation" TEXT,
  "needsAnalysis" TEXT,
  "closedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ComplaintOperation_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ComplaintOperation_assignedToId_fkey"
    FOREIGN KEY ("assignedToId") REFERENCES public."user"("id")
    ON DELETE SET NULL ON UPDATE CASCADE
);
CREATE UNIQUE INDEX IF NOT EXISTS "ComplaintOperation_operationNumber_key"
  ON public."ComplaintOperation"("operationNumber");

CREATE TABLE IF NOT EXISTS public."FieldAwareness" (
  "id" TEXT NOT NULL,
  "projectNumber" TEXT NOT NULL,
  "projectName" TEXT NOT NULL,
  "sector" TEXT NOT NULL,
  "governorate" TEXT NOT NULL,
  "directorate" TEXT NOT NULL,
  "awarenessType" TEXT NOT NULL,
  "projectCategory" TEXT NOT NULL,
  "activityDate" TEXT NOT NULL,
  "location" TEXT NOT NULL,
  "targetAudience" TEXT NOT NULL,
  "activityGoal" TEXT NOT NULL,
  "topic" TEXT NOT NULL,
  "duration" TEXT NOT NULL,
  "totalBeneficiaries" INTEGER NOT NULL,
  "menCount" INTEGER NOT NULL,
  "womenCount" INTEGER NOT NULL,
  "directBeneficiaries" INTEGER NOT NULL,
  "indirectBeneficiaries" INTEGER NOT NULL,
  "description" TEXT NOT NULL,
  "attachments" TEXT,
  "status" TEXT NOT NULL,
  "branch" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FieldAwareness_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS public."FieldBox" (
  "id" TEXT NOT NULL,
  "boxNumber" TEXT NOT NULL,
  "projectNumber" TEXT NOT NULL,
  "projectName" TEXT NOT NULL,
  "installLocation" TEXT NOT NULL,
  "installDate" TEXT NOT NULL,
  "reasonForPlace" TEXT NOT NULL,
  "chosenBy" TEXT NOT NULL,
  "branch" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FieldBox_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "FieldBox_boxNumber_key"
  ON public."FieldBox"("boxNumber");

CREATE TABLE IF NOT EXISTS public."BoxOpeningMinute" (
  "id" TEXT NOT NULL,
  "minuteNumber" TEXT NOT NULL,
  "boxNumber" TEXT NOT NULL,
  "projectNumber" TEXT NOT NULL,
  "projectName" TEXT NOT NULL,
  "openingDate" TEXT NOT NULL,
  "expectedDate" TEXT NOT NULL,
  "deliveryDate" TEXT NOT NULL,
  "entryDate" TEXT NOT NULL,
  "openingCommittee" TEXT NOT NULL,
  "branch" TEXT NOT NULL,
  "totalOperations" INTEGER NOT NULL,
  "complaintsCount" INTEGER NOT NULL,
  "reportsCount" INTEGER NOT NULL,
  "requestsCount" INTEGER NOT NULL,
  "proposalsCount" INTEGER NOT NULL,
  "inquiriesCount" INTEGER NOT NULL,
  "praisesCount" INTEGER NOT NULL,
  "acceptedAttachments" INTEGER NOT NULL,
  "rejectedAttachments" INTEGER NOT NULL,
  "rejectionReasons" TEXT,
  "minuteAttachment" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BoxOpeningMinute_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "BoxOpeningMinute_minuteNumber_key"
  ON public."BoxOpeningMinute"("minuteNumber");

CREATE TABLE IF NOT EXISTS public."InventoryItem" (
  "id" TEXT NOT NULL,
  "itemName" TEXT NOT NULL,
  "suppliedQty" INTEGER NOT NULL,
  "dispensedQty" INTEGER NOT NULL,
  "usedQty" INTEGER NOT NULL,
  "remainingQty" INTEGER NOT NULL,
  "projectTarget" TEXT,
  "movementDate" TEXT NOT NULL,
  "userName" TEXT NOT NULL,
  "branch" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "InventoryItem_pkey" PRIMARY KEY ("id")
);

CREATE TABLE IF NOT EXISTS public."AuditLog" (
  "id" TEXT NOT NULL,
  "operationId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "performedBy" TEXT NOT NULL,
  "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "details" TEXT,
  CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

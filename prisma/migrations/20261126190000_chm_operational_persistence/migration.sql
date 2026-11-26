-- CHM-SFD: durable field monitoring, box opening records, and additional operation data.
ALTER TABLE "ComplaintOperation"
  ADD COLUMN "branch" TEXT NOT NULL DEFAULT 'الإدارة العامة',
  ADD COLUMN "createdById" TEXT,
  ADD COLUMN "additionalData" TEXT,
  ADD CONSTRAINT "ComplaintOperation_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
CREATE INDEX "ComplaintOperation_branch_createdAt_idx" ON "ComplaintOperation"("branch", "createdAt");

CREATE TABLE "ComplaintOperationAttachment" (
  "id" TEXT NOT NULL,
  "operationId" TEXT NOT NULL,
  "stage" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "fileContent" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComplaintOperationAttachment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ComplaintOperationAttachment_operationId_fkey" FOREIGN KEY ("operationId") REFERENCES "ComplaintOperation"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ComplaintOperationAttachment_operationId_idx" ON "ComplaintOperationAttachment"("operationId");

CREATE TABLE "FieldMonitoringVisit" (
  "id" TEXT NOT NULL,
  "projectNumber" TEXT NOT NULL,
  "projectName" TEXT NOT NULL,
  "visitStartDate" TIMESTAMP(3) NOT NULL,
  "visitEndDate" TIMESTAMP(3) NOT NULL,
  "location" TEXT,
  "team" TEXT NOT NULL,
  "goal" TEXT NOT NULL,
  "result" TEXT NOT NULL,
  "branch" TEXT NOT NULL,
  "createdById" TEXT NOT NULL,
  "createdByName" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "FieldMonitoringVisit_pkey" PRIMARY KEY ("id")
);
CREATE INDEX "FieldMonitoringVisit_branch_createdAt_idx" ON "FieldMonitoringVisit"("branch", "createdAt");
CREATE INDEX "FieldMonitoringVisit_projectNumber_idx" ON "FieldMonitoringVisit"("projectNumber");

CREATE TABLE "FieldMonitoringAttachment" (
  "id" TEXT NOT NULL,
  "visitId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "fileContent" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FieldMonitoringAttachment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FieldMonitoringAttachment_visitId_fkey" FOREIGN KEY ("visitId") REFERENCES "FieldMonitoringVisit"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "FieldMonitoringAttachment_visitId_idx" ON "FieldMonitoringAttachment"("visitId");

ALTER TABLE "FieldBox"
  ADD COLUMN "boxCount" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN "status" TEXT NOT NULL DEFAULT 'نشط';

ALTER TABLE "BoxOpeningMinute"
  ADD COLUMN "minutesDate" TEXT NOT NULL DEFAULT '',
  ADD COLUMN "totalDocuments" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "delayStatus" TEXT NOT NULL DEFAULT 'ضمن المدة',
  ADD CONSTRAINT "BoxOpeningMinute_boxNumber_fkey" FOREIGN KEY ("boxNumber") REFERENCES "FieldBox"("boxNumber") ON DELETE RESTRICT ON UPDATE CASCADE;
CREATE INDEX "BoxOpeningMinute_boxNumber_createdAt_idx" ON "BoxOpeningMinute"("boxNumber", "createdAt");
CREATE INDEX "BoxOpeningMinute_branch_createdAt_idx" ON "BoxOpeningMinute"("branch", "createdAt");

CREATE TABLE "FieldBoxAttachment" (
  "id" TEXT NOT NULL,
  "boxNumber" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "fileContent" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FieldBoxAttachment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FieldBoxAttachment_boxNumber_fkey" FOREIGN KEY ("boxNumber") REFERENCES "FieldBox"("boxNumber") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "FieldBoxAttachment_boxNumber_idx" ON "FieldBoxAttachment"("boxNumber");

CREATE TABLE "BoxOpeningMinuteAttachment" (
  "id" TEXT NOT NULL,
  "minuteId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "fileContent" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BoxOpeningMinuteAttachment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BoxOpeningMinuteAttachment_minuteId_fkey" FOREIGN KEY ("minuteId") REFERENCES "BoxOpeningMinute"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "BoxOpeningMinuteAttachment_minuteId_idx" ON "BoxOpeningMinuteAttachment"("minuteId");

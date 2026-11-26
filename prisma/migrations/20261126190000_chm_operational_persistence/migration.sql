-- CHM-SFD: durable field monitoring, box opening records, and additional operation data.
-- Idempotent because the isolated preview branch was prepared with the same additive SQL
-- before Prisma migration history was initialized. This also supports clean environments.

ALTER TABLE public."ComplaintOperation"
  ADD COLUMN IF NOT EXISTS "branch" TEXT NOT NULL DEFAULT 'الإدارة العامة',
  ADD COLUMN IF NOT EXISTS "createdById" TEXT,
  ADD COLUMN IF NOT EXISTS "additionalData" TEXT,
  ADD COLUMN IF NOT EXISTS "minutesNo" TEXT,
  ADD COLUMN IF NOT EXISTS "responseMessage" TEXT;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'ComplaintOperation_createdById_fkey'
      AND conrelid = 'public."ComplaintOperation"'::regclass
  ) THEN
    ALTER TABLE public."ComplaintOperation"
      ADD CONSTRAINT "ComplaintOperation_createdById_fkey"
      FOREIGN KEY ("createdById") REFERENCES public."user"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "ComplaintOperation_branch_createdAt_idx"
  ON public."ComplaintOperation"("branch", "createdAt");

CREATE TABLE IF NOT EXISTS public."ComplaintOperationAttachment" (
  "id" TEXT NOT NULL,
  "operationId" TEXT NOT NULL,
  "stage" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "fileContent" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ComplaintOperationAttachment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ComplaintOperationAttachment_operationId_fkey"
    FOREIGN KEY ("operationId") REFERENCES public."ComplaintOperation"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "ComplaintOperationAttachment_operationId_idx"
  ON public."ComplaintOperationAttachment"("operationId");

CREATE TABLE IF NOT EXISTS public."FieldMonitoringVisit" (
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
CREATE INDEX IF NOT EXISTS "FieldMonitoringVisit_branch_createdAt_idx"
  ON public."FieldMonitoringVisit"("branch", "createdAt");
CREATE INDEX IF NOT EXISTS "FieldMonitoringVisit_projectNumber_idx"
  ON public."FieldMonitoringVisit"("projectNumber");

CREATE TABLE IF NOT EXISTS public."FieldMonitoringAttachment" (
  "id" TEXT NOT NULL,
  "visitId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "fileContent" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FieldMonitoringAttachment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FieldMonitoringAttachment_visitId_fkey"
    FOREIGN KEY ("visitId") REFERENCES public."FieldMonitoringVisit"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "FieldMonitoringAttachment_visitId_idx"
  ON public."FieldMonitoringAttachment"("visitId");

ALTER TABLE public."FieldBox"
  ADD COLUMN IF NOT EXISTS "boxCount" INTEGER NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'نشط';

ALTER TABLE public."BoxOpeningMinute"
  ADD COLUMN IF NOT EXISTS "minutesDate" TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS "totalDocuments" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS "delayStatus" TEXT NOT NULL DEFAULT 'ضمن المدة';

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'BoxOpeningMinute_boxNumber_fkey'
      AND conrelid = 'public."BoxOpeningMinute"'::regclass
  ) THEN
    ALTER TABLE public."BoxOpeningMinute"
      ADD CONSTRAINT "BoxOpeningMinute_boxNumber_fkey"
      FOREIGN KEY ("boxNumber") REFERENCES public."FieldBox"("boxNumber")
      ON DELETE RESTRICT ON UPDATE CASCADE;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS "BoxOpeningMinute_boxNumber_createdAt_idx"
  ON public."BoxOpeningMinute"("boxNumber", "createdAt");
CREATE INDEX IF NOT EXISTS "BoxOpeningMinute_branch_createdAt_idx"
  ON public."BoxOpeningMinute"("branch", "createdAt");

CREATE TABLE IF NOT EXISTS public."FieldBoxAttachment" (
  "id" TEXT NOT NULL,
  "boxNumber" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "fileContent" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FieldBoxAttachment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FieldBoxAttachment_boxNumber_fkey"
    FOREIGN KEY ("boxNumber") REFERENCES public."FieldBox"("boxNumber")
    ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "FieldBoxAttachment_boxNumber_idx"
  ON public."FieldBoxAttachment"("boxNumber");

CREATE TABLE IF NOT EXISTS public."BoxOpeningMinuteAttachment" (
  "id" TEXT NOT NULL,
  "minuteId" TEXT NOT NULL,
  "fileName" TEXT NOT NULL,
  "mimeType" TEXT NOT NULL,
  "fileSize" INTEGER NOT NULL,
  "fileContent" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "BoxOpeningMinuteAttachment_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "BoxOpeningMinuteAttachment_minuteId_fkey"
    FOREIGN KEY ("minuteId") REFERENCES public."BoxOpeningMinute"("id")
    ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX IF NOT EXISTS "BoxOpeningMinuteAttachment_minuteId_idx"
  ON public."BoxOpeningMinuteAttachment"("minuteId");

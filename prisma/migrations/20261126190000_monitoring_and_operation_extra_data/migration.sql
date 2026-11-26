-- Additive CHM-SFD preview migration.
-- This migration must be reviewed and applied only to the isolated preview branch first.
ALTER TABLE public."ComplaintOperation"
  ADD COLUMN IF NOT EXISTS "additionalData" TEXT,
  ADD COLUMN IF NOT EXISTS "branch" TEXT;

CREATE TABLE IF NOT EXISTS public."FieldMonitoringVisit" (
  "id" TEXT NOT NULL,
  "visitNumber" TEXT NOT NULL,
  "projectNumber" TEXT NOT NULL,
  "projectName" TEXT NOT NULL,
  "branch" TEXT NOT NULL,
  "startDate" DATE NOT NULL,
  "endDate" DATE NOT NULL,
  "executor" TEXT NOT NULL,
  "team" TEXT,
  "objective" TEXT NOT NULL,
  "location" TEXT,
  "visitNotes" TEXT,
  "result" TEXT,
  "recommendations" TEXT,
  "requiredActions" TEXT,
  "followupStartDate" DATE,
  "followupEndDate" DATE,
  "followupStatus" TEXT,
  "nextVisitDate" DATE,
  "projectStatus" TEXT,
  "projectType" TEXT,
  "awarenessStatus" TEXT,
  "photoAttachments" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "reportAttachments" JSONB NOT NULL DEFAULT '[]'::jsonb,
  "createdBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "FieldMonitoringVisit_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "FieldMonitoringVisit_visitNumber_key" UNIQUE ("visitNumber"),
  CONSTRAINT "FieldMonitoringVisit_date_check" CHECK ("endDate" >= "startDate")
);

CREATE INDEX IF NOT EXISTS "FieldMonitoringVisit_projectNumber_idx"
  ON public."FieldMonitoringVisit"("projectNumber");
CREATE INDEX IF NOT EXISTS "FieldMonitoringVisit_branch_idx"
  ON public."FieldMonitoringVisit"("branch");
CREATE INDEX IF NOT EXISTS "FieldMonitoringVisit_startDate_idx"
  ON public."FieldMonitoringVisit"("startDate");

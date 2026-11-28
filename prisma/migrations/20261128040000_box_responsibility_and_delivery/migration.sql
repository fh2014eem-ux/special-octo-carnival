ALTER TABLE "FieldBox"
  ADD COLUMN "openingResponsibleName" TEXT,
  ADD COLUMN "openingResponsibleRole" TEXT,
  ADD COLUMN "openingResponsiblePhone" TEXT,
  ADD COLUMN "openingResponsibleNotes" TEXT,
  ADD COLUMN "deliveryResponsibleName" TEXT,
  ADD COLUMN "deliveryResponsibleRole" TEXT,
  ADD COLUMN "deliveryResponsiblePhone" TEXT,
  ADD COLUMN "deliveryResponsibleNotes" TEXT,
  ADD COLUMN "projectSector" TEXT,
  ADD COLUMN "projectUnit" TEXT,
  ADD COLUMN "funder" TEXT,
  ADD COLUMN "notInstalledReason" TEXT,
  ADD COLUMN "statusUpdatedAt" TIMESTAMP(3),
  ADD COLUMN "statusUpdatedBy" TEXT;

ALTER TABLE "FieldBox" ALTER COLUMN "status" SET DEFAULT 'يعمل';
UPDATE "FieldBox" SET "status" = 'يعمل' WHERE "status" IN ('نشط', 'فعال', 'Active');

ALTER TABLE "BoxOpeningMinute"
  ADD COLUMN "deliveredBy" TEXT,
  ADD COLUMN "deliveryMethod" TEXT NOT NULL DEFAULT 'يدوياً',
  ADD COLUMN "deliveryDelayReason" TEXT,
  ADD COLUMN "openingDelayReason" TEXT,
  ADD COLUMN "submittedVia" TEXT NOT NULL DEFAULT 'يدوياً';

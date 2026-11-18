CREATE TABLE IF NOT EXISTS "chm_reference_projects" (
  "project_number" TEXT PRIMARY KEY,
  "project_name" TEXT NOT NULL DEFAULT '',
  "branch" TEXT NOT NULL DEFAULT '',
  "data" JSONB NOT NULL DEFAULT '{}'::jsonb,
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "chm_reference_locations" (
  "location_key" TEXT PRIMARY KEY,
  "governorate" TEXT NOT NULL,
  "directorate" TEXT NOT NULL,
  "sub_district" TEXT NOT NULL DEFAULT '',
  "village" TEXT NOT NULL DEFAULT '',
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "chm_reference_categories" (
  "category_key" TEXT PRIMARY KEY,
  "primary_category" TEXT NOT NULL,
  "sub_category" TEXT NOT NULL DEFAULT '',
  "second_sub_category" TEXT NOT NULL DEFAULT '',
  "active" BOOLEAN NOT NULL DEFAULT TRUE,
  "updated_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE TABLE IF NOT EXISTS "chm_reference_imports" (
  "id" UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  "file_name" TEXT NOT NULL,
  "imported_by" TEXT NOT NULL,
  "row_counts" JSONB NOT NULL,
  "created_at" TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS "chm_reference_locations_hierarchy_idx"
  ON "chm_reference_locations" ("governorate", "directorate", "sub_district");
CREATE INDEX IF NOT EXISTS "chm_reference_projects_name_idx"
  ON "chm_reference_projects" ("project_name");

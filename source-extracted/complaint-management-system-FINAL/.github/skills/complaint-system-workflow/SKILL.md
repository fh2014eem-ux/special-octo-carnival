---
name: complaint-system-workflow
description: "Use when working on the complaint-management system: bug fixes, new complaint features, reports, Prisma schema changes, API route updates, dashboard data work, and Next.js app changes in this project."
---

# Complaint Management System Workflow

## When to use this skill

Use this skill when you need to:

- fix or extend complaint workflows in the Next.js app
- modify API routes under `app/api`
- update Prisma models or data access in `lib/` and `prisma/`
- adjust dashboard, complaint tables, complaint forms, or reports
- investigate issues in stored data, filters, statuses, priorities, or assignments
- preserve the Arabic RTL experience and the complaint management domain language

## Project context to keep in mind

This project is a complaint-management system built with Next.js App Router, Prisma, and a fallback in-memory data layer. The app usually has a combination of:

- UI screens in `app/`
- reusable components in `components/`
- API handlers in `app/api/`
- business/data logic in `lib/`
- Prisma schema in `prisma/schema.prisma`

The system should work in two modes:

1. Real database mode when `DATABASE_URL` is configured
2. In-memory demo mode when no database is configured

When making changes, preserve both flows unless the task explicitly targets only one mode.

## Core workflow

### 1. Identify the problem area

Start by narrowing the issue to one layer:

- UI/UX issue: inspect the page and components involved
- API issue: inspect the route handler and request validation
- Data issue: inspect `lib/data.ts`, `lib/store.ts`, and Prisma schema
- Report/dashboard issue: inspect report logic and aggregate calculations

Use the project structure to locate the likely source quickly before editing.

### 2. Trace the data flow end-to-end

For any complaint-related task, follow the path from the input to the final output:

- page/form -> component -> API request -> route handler -> service/data layer -> Prisma or fallback store
- reverse flow for read/update actions and dashboard reporting

Check whether the issue is caused by:

- missing validation on the server
- mismatched field names between forms and API payloads
- stale or inconsistent types
- wrong status/priority mapping
- filter values not aligned with stored values

### 3. Reproduce and constrain the bug

Before changing code, determine the exact expected behavior:

- what user action triggers the issue
- which record or filter is involved
- what should happen in the database-backed and demo modes
- what existing behavior is currently wrong

Keep the fix narrow and aligned with the root cause, not a broad refactor.

### 4. Implement the minimal root-cause fix

Apply the smallest correct change in the relevant layer:

- add or fix API validation if inputs are incomplete or malformed
- update Prisma schema or model mapping if data shape changed
- fix repository/data-layer logic for reads, filters, and updates
- update form fields or display logic if the UI is not reflecting real data
- keep status names, Arabic labels, priority values, and assignment logic consistent across layers

When changing shared logic, update all affected call sites, not just the first file you notice.

### 5. Keep the app behavior consistent across modes

If the change touches complaint data, verify that both modes still behave correctly:

- database-backed mode must remain compatible with Prisma schema
- in-memory mode must still allow UI testing without a database
- empty states, filters, and list updates should remain coherent in both cases

### 6. Validate before completion

Use the smallest relevant verification that checks the change:

- run the app or relevant route/API checks
- ensure TypeScript/build validation passes when feasible
- check that the affected complaint flow works from input to output
- verify the relevant dashboard, list, and reporting view still reflects the expected values

### 7. Preserve domain correctness

This project is not generic CRUD code; it is a civic complaint system. Keep the following in mind:

- status values and lifecycle should be consistent
- severity/priority semantics must remain clear
- assignment and department logic should not be lost
- report KPIs should match actual complaint data
- Arabic localization and RTL layout should remain stable

## Decision points

### If the issue is in forms or page interaction

Inspect the component tree and form state, then confirm the submitted payload matches the API contract.

### If the issue is in listing or filtering

Check the request params, data layer query logic, and the UI filters together; mismatches often happen between query strings and expected enum values.

### If the issue is in status updates

Review the route handler, the target record update path, and any status mapping used in the UI or report logic.

### If the issue is in reports or dashboards

Trace aggregation logic and ensure the same source data is used across dashboard cards, charts, and complaint lists.

### If the project may run without a database

Do not assume Prisma is always active; inspect the fallback store path and ensure the relevant flow works without `DATABASE_URL`.

## Quality checklist

Before declaring completion, confirm:

- the root cause is addressed, not just symptoms
- all relevant API and UI layers were checked
- the fix preserves Arabic/RTL behavior and complaint-domain terminology
- the app still works in both database-backed and demo modes when relevant
- the code remains minimal and consistent with the project structure

## Example prompts that fit this skill

- "Fix the complaint update flow so status changes are persisted correctly"
- "Add a new filter for complaints by department or priority"
- "Review the dashboard report calculations for mismatched counts"
- "Update the complaint form to include a missing field and validate it on the server"
- "Diagnose why the list page shows stale records in demo mode"

## Related customizations to consider next

- create a project-specific instruction file for API validation conventions
- create a prompt for generating complaint dashboard KPI updates
- create a custom agent for database/schema change reviews

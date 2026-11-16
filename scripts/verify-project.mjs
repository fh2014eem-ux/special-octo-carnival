import fs from 'node:fs'
import path from 'node:path'

const required = [
  'app/page.tsx',
  'app/(main)/operations/page.tsx',
  'app/(main)/operations/new/page.tsx',
  'app/(main)/reports/page.tsx',
  'app/(main)/alerts/page.tsx',
  'components/app-shell.tsx',
  'lib/store.ts',
  'lib/store-context.tsx',
  'lib/types.ts',
  'lib/data.ts',
  'lib/auth.ts',
  'prisma/schema.prisma',
  'pnpm-lock.yaml',
  '.env.example',
]

const missing = required.filter((file) => !fs.existsSync(path.resolve(file)))
const errors = []
const warnings = []

if (missing.length) errors.push(`Missing required project files: ${missing.join(', ')}`)

const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'))
if (!pkg.packageManager?.startsWith('pnpm@')) {
  errors.push('package.json must declare pnpm as the package manager.')
}

for (const file of ['package-lock.json', 'Nnpm-lock.yaml', 'npm-workspace.yaml']) {
  if (fs.existsSync(file)) errors.push(`Conflicting npm lock/workspace file remains: ${file}`)
}

const schema = fs.readFileSync('prisma/schema.prisma', 'utf8')
for (const token of ['model User {', 'model ComplaintOperation {', 'assignedUser', 'assignedToId', 'priority', 'citizenEmail']) {
  if (!schema.includes(token)) errors.push(`Prisma schema is missing required field/model marker: ${token}`)
}

const dataLayer = fs.readFileSync('lib/data.ts', 'utf8')
if (!dataLayer.includes('prisma.complaintOperation')) {
  errors.push('The active API data layer must use ComplaintOperation as its complaint source.')
}
if (dataLayer.includes('prisma.complaint.')) {
  errors.push('The active API data layer still references a non-existent Prisma Complaint model.')
}
if (!dataLayer.includes('process.env.NODE_ENV === "production"')) {
  errors.push('Production must fail closed when DATABASE_URL is missing.')
}

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name)
    if (entry.isDirectory()) walk(full, files)
    else if (/\.(ts|tsx|js|jsx)$/.test(entry.name)) files.push(full)
  }
  return files
}

const activeFiles = ['app', 'components', 'lib'].flatMap((dir) => walk(dir))
for (const file of activeFiles) {
  const source = fs.readFileSync(file, 'utf8')
  if (/from\s+["']workflow(?:\/api)?["']/.test(source)) {
    errors.push(`Unresolved Vercel Workflow dependency remains in active source: ${file}`)
  }
}

const storeContext = fs.readFileSync('lib/store-context.tsx', 'utf8')
if (storeContext.includes('window.localStorage')) {
  warnings.push('The main StoreProvider still persists operational data in browser localStorage; DB migration/auth integration is not complete.')
}
const auth = fs.readFileSync('lib/auth.ts', 'utf8')
if (auth.includes('from "@/lib/db"')) {
  warnings.push('Better Auth uses the pg Pool/Kysely connection while operational data uses Prisma; consolidate or explicitly migrate both paths before production.')
}

if (errors.length) {
  console.error('Project verification: FAILED')
  for (const error of errors) console.error(`ERROR: ${error}`)
  process.exit(1)
}

console.log('Project static verification: PASS')
console.log('Required routes/files and Prisma/API alignment markers are present.')
for (const warning of warnings) console.warn(`WARNING: ${warning}`)

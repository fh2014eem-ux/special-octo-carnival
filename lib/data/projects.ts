// سجل المشاريع المركزي: البيانات الكاملة من ملف المشاريع.xlsx
import referenceData from "./reference-data.generated.json"

export interface Project {
  id: string
  number: string
  name: string
  arabic: string
  funder: string
  officer: string
  sectorMain: string
  sectorSub: string
  intervention: string
  projectType: string
  province: string
  kind: "مشاريع ميدانية" | "مشاريع تدريبية"
  branch: string
  agreementNumber: string
  contractNumber: string
  status: string
  startDate: string
  endDate: string
}

export const PROJECTS: Project[] = referenceData.projects.map((p, index) => ({
  id: p.number || `PROJECT-${index + 1}`,
  number: p.number,
  name: p.name,
  arabic: p.name,
  funder: p.funder,
  officer: p.officer,
  sectorMain: p.sector,
  sectorSub: p.unit,
  intervention: "",
  projectType: p.partnerType,
  province: "",
  kind: p.partnerType.includes("تدريب") ? "مشاريع تدريبية" : "مشاريع ميدانية",
  branch: p.branch,
  agreementNumber: p.agreementNumber,
  contractNumber: p.contractNumber,
  status: p.status,
  startDate: p.startDate,
  endDate: p.endDate,
}))

export function findProjectByNumber(num: string): Project | undefined {
  return PROJECTS.find((p) => String(p.number).trim() === String(num).trim())
}
export function findProjectByName(name: string): Project | undefined {
  const q = name.trim()
  return PROJECTS.find((p) => p.name === q || p.arabic === q)
}
export function projectsForProvince(_province?: string): Project[] {
  // ملف المشاريع لا يتضمن عمود محافظة مستقل؛ لا يجوز استنتاج المحافظة من اسم المشروع.
  return PROJECTS
}

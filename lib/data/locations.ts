// بيانات المواقع المرجعية الكاملة المستوردة من ملف المواقع.xlsx
import referenceData from "./reference-data.generated.json"

export type IsolationMap = Record<string, string[]>
export type DirectorateMap = Record<string, IsolationMap>
export type ProvinceMap = Record<string, DirectorateMap>

const hierarchy: ProvinceMap = {}
for (const row of referenceData.locations) {
  if (!row.governorate || !row.directorate || !row.subDistrict || !row.village) continue
  hierarchy[row.governorate] ??= {}
  hierarchy[row.governorate][row.directorate] ??= {}
  hierarchy[row.governorate][row.directorate][row.subDistrict] ??= []
  if (!hierarchy[row.governorate][row.directorate][row.subDistrict].includes(row.village)) {
    hierarchy[row.governorate][row.directorate][row.subDistrict].push(row.village)
  }
}

export const LOCATION_HIERARCHY: ProvinceMap = hierarchy
export const PROVINCES = Object.keys(LOCATION_HIERARCHY)

export function getDirectorates(province: string): string[] {
  return Object.keys(LOCATION_HIERARCHY[province] ?? {})
}
export function getIsolations(province: string, directorate: string): string[] {
  return Object.keys(LOCATION_HIERARCHY[province]?.[directorate] ?? {})
}
export function getVillages(province: string, directorate: string, isolation: string): string[] {
  return LOCATION_HIERARCHY[province]?.[directorate]?.[isolation] ?? []
}
export const LOCATIONS = PROVINCES.map((name, index) => ({ id: `LOC-${index + 1}`, name }))

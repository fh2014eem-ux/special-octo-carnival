"use client"

import { SelectField } from "@/components/form/fields"
import { getDirectorates, getIsolations, getVillages, PROVINCES } from "@/lib/data/locations"

export interface LocationValue {
  province: string
  directorate: string
  isolation: string
  village: string
}

export function LocationPicker({
  value,
  onChange,
  lockProvince,
}: {
  value: LocationValue
  onChange: (v: LocationValue) => void
  lockProvince?: string
}) {
  const provinceOptions = lockProvince ? [lockProvince] : PROVINCES
  const directorates = getDirectorates(value.province)
  const isolations = getIsolations(value.province, value.directorate)
  const villages = getVillages(value.province, value.directorate, value.isolation)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <SelectField
        label="المحافظة"
        required
        value={value.province}
        options={provinceOptions}
        disabled={Boolean(lockProvince)}
        onChange={(province) => onChange({ province, directorate: "", isolation: "", village: "" })}
      />
      <SelectField
        label="المديرية"
        value={value.directorate}
        options={directorates}
        disabled={!value.province}
        onChange={(directorate) => onChange({ ...value, directorate, isolation: "", village: "" })}
      />
      <SelectField
        label="العزلة"
        value={value.isolation}
        options={isolations}
        disabled={!value.directorate}
        onChange={(isolation) => onChange({ ...value, isolation, village: "" })}
      />
      <SelectField
        label="القرية / الحي"
        value={value.village}
        options={villages}
        disabled={!value.isolation}
        onChange={(village) => onChange({ ...value, village })}
      />
    </div>
  )
}

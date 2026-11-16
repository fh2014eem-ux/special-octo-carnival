"use client"

import { SelectField } from "@/components/form/fields"
import referenceData from "@/lib/data/reference-data.generated.json"

const CATEGORY_TREE = referenceData.categories
const MAIN_CLASSES = CATEGORY_TREE.map((item) => item.name)

export function ClassificationPicker({
  mainClass,
  subClass,
  subClass2 = "",
  onChange,
}: {
  mainClass: string
  subClass: string
  subClass2?: string
  onChange: (v: { mainClass: string; subClass: string; subClass2?: string }) => void
}) {
  const main = CATEGORY_TREE.find((item) => item.name === mainClass)
  const subOptions = main?.children.map((item) => item.name) ?? []
  const sub = main?.children.find((item) => item.name === subClass)
  const secondOptions = sub?.children ?? []

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      <SelectField
        label="التصنيف الرئيسي"
        value={mainClass}
        options={MAIN_CLASSES}
        onChange={(m) => onChange({ mainClass: m, subClass: "", subClass2: "" })}
      />
      <SelectField
        label="التصنيف الفرعي"
        value={subClass}
        options={subOptions}
        disabled={!mainClass || subOptions.length === 0}
        onChange={(s) => onChange({ mainClass, subClass: s, subClass2: "" })}
      />
      <SelectField
        label="التصنيف الفرعي الثاني"
        value={subClass2}
        options={secondOptions}
        disabled={!subClass || secondOptions.length === 0}
        onChange={(s) => onChange({ mainClass, subClass, subClass2: s })}
      />
    </div>
  )
}

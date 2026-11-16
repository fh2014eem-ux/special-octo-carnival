"use client"

import type { ReactNode } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { cn } from "@/lib/utils"

export function Field({
  label,
  required,
  children,
  className,
  hint,
}: {
  label: string
  required?: boolean
  children: ReactNode
  className?: string
  hint?: string
}) {
  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <Label className="text-sm">
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

export function TextField({
  label,
  value,
  onChange,
  required,
  placeholder,
  type = "text",
  className,
  hint,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  placeholder?: string
  type?: string
  className?: string
  hint?: string
}) {
  return (
    <Field label={label} required={required} className={className} hint={hint}>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </Field>
  )
}

export function TextAreaField({
  label,
  value,
  onChange,
  required,
  placeholder,
  className,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  required?: boolean
  placeholder?: string
  className?: string
  rows?: number
}) {
  return (
    <Field label={label} required={required} className={className}>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={rows} />
    </Field>
  )
}

export function SelectField({
  label,
  value,
  onChange,
  options,
  required,
  placeholder = "اختر...",
  className,
  disabled,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: readonly string[]
  required?: boolean
  placeholder?: string
  className?: string
  disabled?: boolean
}) {
  return (
    <Field label={label} required={required} className={className}>
      <Select value={value || undefined} onValueChange={onChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {options.map((opt) => (
            <SelectItem key={opt} value={opt}>
              {opt}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  )
}

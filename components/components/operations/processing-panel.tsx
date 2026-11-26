"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useStore } from "@/lib/store"
import type { Operation } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, SelectField, TextAreaField, TextField } from "@/components/form/fields"
import { ClassificationPicker } from "@/components/form/classification-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  SENSITIVITY,
  STATUS,
  STATUS_LIST,
  RESPONSE_CHANNELS,
  MESSAGE_CHANNELS,
  EVALUATIONS,
} from "@/lib/data/constants"

export function ProcessingPanel({ op }: { op: Operation }) {
  const { updateOperation, responders } = useStore()

  const [mainClass, setMainClass] = useState(op.mainClass ?? "")
  const [subClass, setSubClass] = useState(op.subClass ?? "")
  const [sensitivity, setSensitivity] = useState(op.sensitivity ?? "")
  const [minutesNo, setMinutesNo] = useState(op.minutesNo ?? "")
  const [officerReply, setOfficerReply] = useState(op.officerReply ?? "")
  const [responder, setResponder] = useState(op.responder ?? "")
  const [status, setStatus] = useState(op.status)

  function saveProcessing() {
    updateOperation(op.id, {
      mainClass,
      subClass,
      sensitivity,
      minutesNo: minutesNo.trim() || undefined,
      officerReply: officerReply.trim() || undefined,
      responder: responder || undefined,
      status: status === STATUS.NEW ? STATUS.PROCESSING : status,
    })
    toast.success("تم حفظ بيانات المعالجة")
  }

  // Closure stage
  const [closure, setClosure] = useState(op.closure ?? "")
  const [replyChannels, setReplyChannels] = useState<string[]>(op.replyChannels ?? [])
  const [message, setMessage] = useState(op.message ?? "")
  const [evaluation, setEvaluation] = useState(op.evaluation ?? "")

  const needsMessage = replyChannels.some((c) => MESSAGE_CHANNELS.includes(c))

  function toggleChannel(c: string) {
    setReplyChannels((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  function closeOperation() {
    if (!closure.trim()) {
      toast.error("يرجى إدخال ملخص الإغلاق / الإجراء المتخذ.")
      return
    }
    if (replyChannels.length === 0) {
      toast.error("يرجى اختيار قناة رد واحدة على الأقل.")
      return
    }
    if (needsMessage && !message.trim()) {
      toast.error("قناة الرد المختارة تتطلب كتابة نص الرسالة.")
      return
    }
    updateOperation(op.id, {
      closure: closure.trim(),
      replyChannels,
      message: message.trim() || undefined,
      evaluation: evaluation || undefined,
      status: STATUS.CLOSED,
    })
    toast.success("تم إغلاق العملية بنجاح")
  }

  const isClosed = op.status === STATUS.CLOSED

  return (
    <div className="flex flex-col gap-6">
      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">المرحلة الثانية · المعالجة والتصنيف</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <ClassificationPicker
            mainClass={mainClass}
            subClass={subClass}
            onChange={(v) => {
              setMainClass(v.mainClass)
              setSubClass(v.subClass)
            }}
          />
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SelectField
              label="درجة الحساسية"
              value={sensitivity}
              options={SENSITIVITY}
              onChange={setSensitivity}
            />
            <TextField label="رقم المحضر" value={minutesNo} onChange={setMinutesNo} placeholder="اختياري" />
            <Field label="جهة الرد / المعالج">
              <Select value={responder || undefined} onValueChange={setResponder}>
                <SelectTrigger>
                  <SelectValue placeholder="اختر المعالج" />
                </SelectTrigger>
                <SelectContent>
                  {responders
                    .filter((r) => r.active)
                    .map((r) => (
                      <SelectItem key={r.id} value={r.name}>
                        {r.name}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </Field>
            <SelectField
              label="الحالة"
              value={status}
              options={STATUS_LIST}
              onChange={(v) => setStatus(v as Operation["status"])}
            />
          </div>
          <TextAreaField
            label="رد / ملاحظات المختص"
            value={officerReply}
            onChange={setOfficerReply}
            placeholder="أدخل رد المختص أو ملاحظات المعالجة..."
            rows={4}
          />
          <div className="flex justify-end">
            <Button onClick={saveProcessing} disabled={isClosed}>
              حفظ المعالجة
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader>
          <CardTitle className="text-base">المرحلة الثالثة · الإغلاق والرد</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <TextAreaField
            label="ملخص الإجراء المتخذ / الإغلاق"
            value={closure}
            onChange={setClosure}
            placeholder="اذكر الإجراء النهائي وكيفية معالجة العملية..."
            rows={4}
          />
          <Field label="قنوات الرد" hint="يمكن اختيار أكثر من قناة">
            <div className="flex flex-wrap gap-2">
              {RESPONSE_CHANNELS.map((c) => {
                const active = replyChannels.includes(c)
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleChannel(c)}
                    className={
                      "rounded-full border px-3 py-1.5 text-sm transition-colors " +
                      (active
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background text-muted-foreground hover:border-primary/40")
                    }
                  >
                    {c}
                  </button>
                )
              })}
            </div>
          </Field>
          {needsMessage && (
            <TextAreaField
              label="نص رسالة الرد"
              value={message}
              onChange={setMessage}
              placeholder="اكتب نص الرسالة التي سترسل لمقدّم الطلب..."
              rows={3}
            />
          )}
          <SelectField
            label="تقييم العملية"
            value={evaluation}
            options={EVALUATIONS}
            onChange={setEvaluation}
          />
          <div className="flex justify-end">
            <Button onClick={closeOperation} disabled={isClosed} className="bg-chart-3 hover:bg-chart-3/90">
              {isClosed ? "العملية مغلقة" : "إغلاق العملية"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import { useState } from "react"
import { toast } from "sonner"
import { useStore } from "@/lib/store"
import type { Operation } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Field, SelectField, TextAreaField, TextField } from "@/components/form/fields"
import { ClassificationPicker } from "@/components/form/classification-picker"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SENSITIVITY, STATUS, STATUS_LIST, RESPONSE_CHANNELS, MESSAGE_CHANNELS, EVALUATIONS } from "@/lib/data/constants"

export function ProcessingPanel({ op }: { op: Operation }) {
  const { updateOperation, responders } = useStore()

  const [mainClass, setMainClass] = useState(op.mainClass ?? "")
  const [subClass, setSubClass] = useState(op.subClass ?? "")
  const [sensitivity, setSensitivity] = useState(op.sensitivity ?? "")
  const [minutesNo, setMinutesNo] = useState(op.minutesNo ?? "")
  const [officerReply, setOfficerReply] = useState(op.officerReply ?? "")
  const [responder, setResponder] = useState(op.responder ?? "")
  const [status, setStatus] = useState(op.status)

  // شرط إظهار رقم المحضر فقط مع قناة "صندوق الشكاوى"
  const isComplaintBox = op.channel === "صندوق الشكاوى"

  async function saveProcessing() {
    try {
      await updateOperation(op.id, {
        mainClass,
        subClass,
        sensitivity,
        minutesNo: isComplaintBox ? (minutesNo.trim() || undefined) : undefined,
        officerReply: officerReply.trim() || undefined,
        responder: responder || undefined,
        status: status === STATUS.NEW ? STATUS.PROCESSING : status,
      })
      toast.success("تم حفظ بيانات المعالجة والتصنيف في قاعدة البيانات")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر حفظ بيانات المعالجة")
    }
  }

  const [closure, setClosure] = useState(op.closure ?? "")
  const [replyChannels, setReplyChannels] = useState<string[]>(op.replyChannels ?? [])
  const [message, setMessage] = useState(op.message ?? "")
  const [evaluation, setEvaluation] = useState(op.evaluation ?? "")

  const needsMessage = replyChannels.some((c) => MESSAGE_CHANNELS.includes(c))

  function toggleChannel(c: string) {
    setReplyChannels((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))
  }

  async function closeOperation() {
    if (!closure.trim()) {
      toast.error("يرجى إدخال ملخص الإجراء المتخذ للإغلاق.")
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

    try {
      await updateOperation(op.id, {
        closure: closure.trim(),
        replyChannels,
        message: message.trim() || undefined,
        evaluation: evaluation || undefined,
        status: STATUS.CLOSED,
      })
      toast.success("تم إغلاق العملية وحفظها في قاعدة البيانات")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "تعذر إغلاق العملية")
    }
  }

  const isClosed = op.status === STATUS.CLOSED

  return (
    <div className="flex flex-col gap-6">
      {/* المرحلة الثانية: المعالجة والتصنيف */}
      <Card className="border-border/60">
        <CardHeader className="bg-gray-50/50 py-3 border-b">
          <CardTitle className="text-sm font-bold text-gray-800">المرحلة الثانية · المعالجة والتصنيف</CardTitle>
        </CardHeader>

        <CardContent className="p-5 flex flex-col gap-4">
          <ClassificationPicker
            mainClass={mainClass}
            subClass={subClass}
            onChange={(v) => {
              setMainClass(v.mainClass)
              setSubClass(v.subClass)
            }}
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SelectField
              label="درجة الحساسية"
              value={sensitivity}
              options={SENSITIVITY}
              onChange={setSensitivity}
            />

            {/* يظهر حقل رقم المحضر حصراً مع صندوق الشكاوى */}
            {isComplaintBox && (
              <TextField
                label="رقم المحضر"
                value={minutesNo}
                onChange={setMinutesNo}
                placeholder="أدخل رقم المحضر الخاص بالصندوق"
              />
            )}

            <Field label="جهة الرد / المعالج">
              <Select
                value={responder || undefined}
                onValueChange={(value) => setResponder(value ?? "")}
              >
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
            rows={3}
          />

          <div className="flex justify-end pt-2">
            <Button onClick={saveProcessing} disabled={isClosed}>
              حفظ المعالجة
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* المرحلة الثالثة: الإغلاق والرد */}
      <Card className="border-border/60">
        <CardHeader className="bg-gray-50/50 py-3 border-b">
          <CardTitle className="text-sm font-bold text-gray-800">المرحلة الثالثة · الإغلاق والرد</CardTitle>
        </CardHeader>

        <CardContent className="p-5 flex flex-col gap-4">
          <TextAreaField
            label="ملخص الإجراء المتخذ / الإغلاق"
            value={closure}
            onChange={setClosure}
            placeholder="اذكر الإجراء النهائي وكيفية معالجة العملية..."
            rows={3}
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
                      "rounded-full border px-3 py-1 text-xs font-semibold transition-colors " +
                      (active
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-gray-300 bg-gray-50 text-gray-600 hover:bg-gray-100")
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectField
              label="تقييم العملية"
              value={evaluation}
              options={EVALUATIONS}
              onChange={setEvaluation}
            />
          </div>

          <div className="flex justify-end pt-2">
            <Button
              onClick={closeOperation}
              disabled={isClosed}
              className="bg-emerald-600 hover:bg-emerald-700 text-white"
            >
              {isClosed ? "العملية مغلقة" : "إغلاق العملية"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
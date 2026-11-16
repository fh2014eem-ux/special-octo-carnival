"use client"

import { useMemo, useState } from "react"
import { Plus, Search } from "lucide-react"
import { toast } from "sonner"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Field,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { complaints } from "@/lib/mock-data"
import {
  categoryLabels,
  channelLabels,
  priorityLabels,
  statusLabels,
  type Complaint,
  type ComplaintPriority,
  type ComplaintStatus,
} from "@/lib/types"

const statusVariant: Record<
  ComplaintStatus,
  "default" | "secondary" | "destructive" | "outline"
> = {
  NEW: "default",
  IN_PROGRESS: "secondary",
  RESOLVED: "outline",
  CLOSED: "outline",
  REJECTED: "destructive",
}

const priorityVariant: Partial<Record<
  ComplaintPriority,
  "default" | "secondary" | "destructive" | "outline"
>> = {
  LOW: "outline",
  MEDIUM: "secondary",
  HIGH: "default",
  CRITICAL: "destructive",
}

function ComplaintsTable({ rows }: { rows: Complaint[] }) {
  if (rows.length === 0) {
    return (
      <div className="flex h-32 items-center justify-center text-sm text-muted-foreground">
        لا توجد شكاوى مطابقة.
      </div>
    )
  }
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>الرقم المرجعي</TableHead>
          <TableHead>العنوان</TableHead>
          <TableHead>النوع</TableHead>
          <TableHead>القناة</TableHead>
          <TableHead>الموقع</TableHead>
          <TableHead>الأولوية</TableHead>
          <TableHead>الحالة</TableHead>
          <TableHead>التاريخ</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((c) => (
          <TableRow key={c.id}>
            <TableCell className="font-mono text-xs">{c.referenceNo}</TableCell>
            <TableCell className="max-w-52 truncate font-medium">
              {c.title}
            </TableCell>
            <TableCell>{categoryLabels[c.category]}</TableCell>
            <TableCell className="text-muted-foreground">
              {channelLabels[c.channel ?? ""]}
            </TableCell>
            <TableCell className="text-muted-foreground">
              {c.location ?? "—"}
            </TableCell>
            <TableCell>
              <Badge variant={priorityVariant[c.priority] ?? "outline"}>
                {priorityLabels[c.priority]}
              </Badge>
            </TableCell>
            <TableCell>
              <Badge variant={statusVariant[c.status]}>
                {statusLabels[c.status]}
              </Badge>
            </TableCell>
            <TableCell className="text-muted-foreground tabular-nums">
              {c.createdAt}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function NewComplaintDialog() {
  const [open, setOpen] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setOpen(false)
    toast.success("تم تسجيل الشكوى بنجاح", {
      description: "سيتم إسناد الشكوى وإصدار رقم مرجعي لها.",
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<Button />}>
        <Plus data-icon="inline-start" />
        تسجيل شكوى جديدة
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>تسجيل شكوى / بلاغ جديد</DialogTitle>
            <DialogDescription>
              أدخل تفاصيل الشكوى وسيتم توليد رقم مرجعي تلقائياً.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-2">
            <Field>
              <FieldLabel htmlFor="title">عنوان الشكوى</FieldLabel>
              <Input id="title" name="title" required placeholder="عنوان مختصر" />
            </Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>النوع</FieldLabel>
                <Select defaultValue="COMPLAINT">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(categoryLabels).map(([v, l]) => (
                      <SelectItem key={v} value={v}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel>الأولوية</FieldLabel>
                <Select defaultValue="MEDIUM">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(priorityLabels).map(([v, l]) => (
                      <SelectItem key={v} value={v}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field>
                <FieldLabel>قناة الاستلام</FieldLabel>
                <Select defaultValue="BOX">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(channelLabels).map(([v, l]) => (
                      <SelectItem key={v} value={v}>
                        {l}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>
              <Field>
                <FieldLabel htmlFor="location">الموقع / المحافظة</FieldLabel>
                <Input id="location" name="location" placeholder="المحافظة - المديرية" />
              </Field>
            </div>

            <Field>
              <FieldLabel htmlFor="complainant">مقدم الشكوى (اختياري)</FieldLabel>
              <Input id="complainant" name="complainant" placeholder="الاسم أو اترك فارغاً للإبلاغ المجهول" />
            </Field>

            <Field>
              <FieldLabel htmlFor="description">التفاصيل</FieldLabel>
              <Textarea
                id="description"
                name="description"
                required
                rows={4}
                placeholder="اكتب وصفاً تفصيلياً للشكوى..."
              />
            </Field>
          </FieldGroup>

          <DialogFooter>
            <DialogClose render={<Button variant="outline" type="button" />}>
              إلغاء
            </DialogClose>
            <Button type="submit">حفظ الشكوى</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function ComplaintsSection() {
  const [query, setQuery] = useState("")
  const [tab, setTab] = useState("all")

  const filtered = useMemo(() => {
    return complaints.filter((c) => {
      const matchesQuery =
        query.trim() === "" ||
        c.title.includes(query) ||
        c.referenceNo.includes(query) ||
        (c.location?.includes(query) ?? false)
      const matchesTab =
        tab === "all" ||
        (tab === "open" && (c.status === "NEW" || c.status === "IN_PROGRESS")) ||
        (tab === "resolved" &&
          (c.status === "RESOLVED" || c.status === "CLOSED")) ||
        (tab === "rejected" && c.status === "REJECTED")
      return matchesQuery && matchesTab
    })
  }, [query, tab])

  return (
    <Card>
      <CardHeader className="gap-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle>سجل الشكاوى والبلاغات</CardTitle>
            <CardDescription>
              متابعة وإدارة جميع الشكاوى الواردة عبر القنوات المختلفة
            </CardDescription>
          </div>
          <NewComplaintDialog />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList>
              <TabsTrigger value="all">الكل</TabsTrigger>
              <TabsTrigger value="open">مفتوحة</TabsTrigger>
              <TabsTrigger value="resolved">تم حلها</TabsTrigger>
              <TabsTrigger value="rejected">مرفوضة</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="relative">
            <Search className="pointer-events-none absolute inset-y-0 start-3 my-auto size-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="بحث بالرقم أو العنوان أو الموقع..."
              className="w-72 ps-9"
              aria-label="بحث في الشكاوى"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsContent value={tab}>
            <ComplaintsTable rows={filtered} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

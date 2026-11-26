"use client"

import { Save, Users, ShieldCheck } from "lucide-react"
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
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

const roleLabels: Record<string, string> = {
  ADMIN: "مدير النظام",
  SUPERVISOR: "مشرف",
  AGENT: "موظف خدمة",
  FIELD: "منسق ميداني",
}

const users = [
  { id: "u1", name: "المشرف العام", email: "admin@complaints.org", role: "ADMIN" },
  { id: "u2", name: "منسق المنطقة أ", email: "coord.a@complaints.org", role: "SUPERVISOR" },
  { id: "u3", name: "موظف خدمة أ", email: "agent.a@complaints.org", role: "AGENT" },
  { id: "u4", name: "منسق التوعية - خالد", email: "khaled@complaints.org", role: "FIELD" },
]

const roleVariant: Record<string, "default" | "secondary" | "outline"> = {
  ADMIN: "default",
  SUPERVISOR: "secondary",
  AGENT: "outline",
  FIELD: "outline",
}

export function SettingsSection() {
  return (
    <Tabs defaultValue="general" className="gap-4">
      <TabsList>
        <TabsTrigger value="general">إعدادات عامة</TabsTrigger>
        <TabsTrigger value="users">المستخدمون والصلاحيات</TabsTrigger>
      </TabsList>

      <TabsContent value="general">
        <Card>
          <CardHeader>
            <CardTitle>الإعدادات العامة</CardTitle>
            <CardDescription>
              إعدادات المؤسسة واتفاقية مستوى الخدمة الافتراضية
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                toast.success("تم حفظ الإعدادات")
              }}
            >
              <FieldGroup>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel htmlFor="orgName">اسم المؤسسة</FieldLabel>
                    <Input id="orgName" defaultValue="مؤسسة الإغاثة الإنسانية" />
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="projectCode">رمز المشروع الافتراضي</FieldLabel>
                    <Input id="projectCode" defaultValue="PRJ-101" />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field>
                    <FieldLabel>مهلة SLA للأولوية الحرجة</FieldLabel>
                    <Select defaultValue="1">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">يوم واحد</SelectItem>
                        <SelectItem value="2">يومان</SelectItem>
                        <SelectItem value="3">ثلاثة أيام</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field>
                    <FieldLabel>مهلة SLA للأولوية العادية</FieldLabel>
                    <Select defaultValue="7">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">خمسة أيام</SelectItem>
                        <SelectItem value="7">سبعة أيام</SelectItem>
                        <SelectItem value="14">أربعة عشر يوماً</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                </div>
                <div>
                  <Button type="submit">
                    <Save data-icon="inline-start" />
                    حفظ الإعدادات
                  </Button>
                </div>
              </FieldGroup>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="users">
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <CardTitle>المستخدمون والصلاحيات</CardTitle>
                <CardDescription>
                  إدارة حسابات المستخدمين وأدوارهم في النظام
                </CardDescription>
              </div>
              <Button variant="outline">
                <Users data-icon="inline-start" />
                إضافة مستخدم
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>المستخدم</TableHead>
                  <TableHead>البريد الإلكتروني</TableHead>
                  <TableHead>الدور</TableHead>
                  <TableHead>الصلاحية</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((u) => (
                  <TableRow key={u.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="size-8">
                          <AvatarFallback>
                            {u.name.slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium">{u.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-xs text-muted-foreground">
                      {u.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant={roleVariant[u.role]}>
                        {roleLabels[u.role]}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <span className="flex items-center gap-1 text-xs text-muted-foreground">
                        <ShieldCheck className="size-3.5" />
                        {u.role === "ADMIN" ? "كامل" : "محدود"}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

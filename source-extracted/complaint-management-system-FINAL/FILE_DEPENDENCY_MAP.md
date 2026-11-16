# خريطة اعتماد الملفات — نظام إدارة الشكاوى

## 1) نقاط الدخول
| الملف | الدور | الحالة |
|---|---|---|
| `app/page.tsx` | واجهة Dashboard قديمة/مستقلة مع محاور متعددة داخل الصفحة | تعارض مع route group |
| `app/(main)/page.tsx` | Dashboard يعتمد على Store والعمليات | مرشح المسار التشغيلي الحالي |
| `app/layout.tsx` | Layout العام | أساسي |
| `app/(main)/layout.tsx` | Layout لمسار العمليات | أساسي للمسار الحالي |

## 2) طبقة الواجهة
- `components/app-shell.tsx`: shell يعتمد على `useStore`.
- `components/login-screen.tsx`: Login يعتمد على Store المحلي.
- `components/complaints/login-screen.tsx`: نسخة Login أخرى.
- `components/dashboard/sections/*`: محاور Dashboard القديمة/المتكاملة.
- `components/operations/*`: مسار العمليات الحالي.

## 3) طبقة الحالة
- `lib/store.tsx`: Store رئيسي كبير يعتمد على localStorage وseed.
- `lib/store.ts`: Store/بيانات قديمة أخرى.
- `lib/stats.ts`: إحصاءات العمليات.

## 4) طبقة البيانات
- `lib/data.ts`: طبقة بيانات تعتمد على Prisma/قاعدة البيانات مع fallback.
- `lib/db/index.ts`: اتصال Drizzle/pg.
- `lib/db/schema.ts`: جداول Better Auth + complaints في Drizzle.
- `lib/prisma.ts`: Prisma Client.
- `prisma/schema.prisma`: Prisma schema مختلف عن schema Drizzle.
- `lib/data/seed.ts`: بيانات تشغيل تجريبية للـ Store.
- `lib/mock-data.ts`: بيانات Mock إضافية.

## 5) المصادقة
- `lib/auth.ts`: Better Auth server.
- `lib/auth-client.ts`: Better Auth client.
- `app/api/auth/[...all]/route.ts`: route للمصادقة.
- `lib/store.tsx`: Login محلي باسم مستخدم/كلمة مرور داخل localStorage.

## 6) API
- `app/api/complaints/route.ts`
- `app/api/complaints/[id]/route.ts`
- `app/api/reports/route.ts`
- `app/api/users/route.ts`

## 7) البيانات المرجعية
- `lib/data/constants.ts`
- `lib/data/locations.ts`
- `lib/data/projects.ts`

## 8) الملفات التي لا ينبغي حذفها في المرحلة الحالية
أي ملف يحتوي على وظائف من محاور: العمليات، الإدارة الميدانية، الصناديق، المحاضر، التحليل، المتابعة، المخزون، التقارير، المستخدمين، الصلاحيات أو البيانات المرجعية يجب إبقاؤه حتى يتم تحديد البديل والاعتماد عليه.

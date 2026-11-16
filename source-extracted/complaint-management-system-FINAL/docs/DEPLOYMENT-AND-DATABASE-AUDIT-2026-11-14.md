# تقرير فحص مشروع CHM-SFD — 14 نوفمبر 2026

## الملفات التي تم فحصها
- `CHM-working-checkpoint-2026-11-13(1).zip` (660,835 بايت، 258 مدخلاً)
- ملفات المصدر داخل `complaint-management-system-FINAL/`، بما فيها `package.json` و`pnpm-lock.yaml` و`prisma/schema.prisma` و`lib/data.ts` و`lib/store-context.tsx` وملفات API.
- ملف البيانات المرجعية `lib/data/reference-data.generated.json` ويحتوي 508 مشروعاً و17,004 سجلات مواقع.
- سجلّات النشر ومعلومات مشاريع Vercel المرتبطة بمستودع GitHub `fh2014eem-ux/special-octo-carnival`.

## الحالة الفعلية للنشر

1. الرابط الحالي `https://special-octo-carnival-1ayy.vercel.app/` يعيد HTTP 200، لكنه يعرض صفحة تعريفية فقط باسم CHM-SFD ورسالة أن الخادم يعمل.
2. المسارات `/operations` و`/complaints` و`/reports` و`/api/complaints` تعيد HTTP 404؛ لذلك هذه النسخة ليست لوحة النظام ولا واجهات التشغيل.
3. مشروع Vercel المسمى `special-octo-carnival` مرتبط بمستودع GitHub اسمه `-` وليس `special-octo-carnival`. آخر محاولة بناء له على commit `3bbc713` توقفت لأن إعداد Install Command كان `chm`، وانتهت بالخطأ `BUILD_UTILS_SPAWN_127`.
4. توجد ثلاثة مشاريع Vercel مرتبطة بالمستودع الصحيح `fh2014eem-ux/special-octo-carnival`: `special-octo-carnival-1ayy` و`special-octo-carnival-kdxa` و`special-octo-carnival-5oue`. آخر نشر معروف لها على commit `0cb3c30` حالته READY، لكنه ينشر صفحة البداية التعريفية فقط.
5. مشروع `special-octo-carnival-1ayy` لا يحتوي متغيرات بيئة. المشروع `special-octo-carnival-5oue` لديه متغيرات PostgreSQL/Prisma في Preview فقط، ولا توجد متغيرات Production ظاهرة في قائمة البيئة.

## نتائج فحص النسخة المضغوطة

### عوائق البناء
- `app/api/signup/route.ts` يستورد `workflow/api`، و`workflows/user-signup.ts` يستورد `workflow`، لكن الحزمة `workflow` غير موجودة في `package.json`.
- المسار يستورد `handleUserSignup` بينما ملف `workflows/user-signup.ts` لا يصدّر دالة بهذا الاسم.
- `package.json` يحدد pnpm، ويوجد `pnpm-lock.yaml`، لكن الأرشيف يحتوي كذلك `package-lock.json` و`Nnpm-lock.yaml` وملف `npm-workspace.yaml`؛ يلزم اعتماد مدير حزم واحد وتنظيف ملفات القفل المتعارضة بعد التحقق.

### تعارض قاعدة البيانات
- `lib/data.ts` يستخدم Prisma models باسم `prisma.complaint` وحقولاً مثل `referenceNo` و`title` و`citizenName` و`category`.
- `prisma/schema.prisma` لا يحتوي model باسم `Complaint`؛ الموجود هو `ComplaintOperation` بحقول مختلفة مثل `operationNumber` و`subject` و`applicantName` و`primaryCategory`.
- `lib/data.ts` يرتب المستخدمين باستخدام `User.name`، بينما نموذج `User` الحالي لا يحتوي حقل `name`.
- `lib/complaints-repo.ts` يشير أيضاً إلى `complaint` و`report` غير الموجودين في مخطط Prisma، رغم استبعاده من فحص TypeScript الحالي.
- `lib/auth.ts` يستخدم اتصال `pg.Pool` عبر Better Auth/Kysely، بينما مسار البيانات يستخدم Prisma؛ يوجد عميلان للوصول إلى PostgreSQL ومخططان منفصلان للمستخدمين/الشكاوى. كما أن كائن Drizzle في `lib/db/index.ts` غير مستخدم مباشرة في المصادقة الحالية.

### تخزين البيانات والمصادقة
- `StoreProvider` في `lib/store-context.tsx` يحفظ المستخدمين والعمليات والبلاغات والصناديق والتحليلات والمتابعة والمخزون في `localStorage`، ولا يرسل هذه التغييرات إلى PostgreSQL.
- تسجيل الدخول والتحقق من كلمات المرور يتمان في المتصفح، وتوجد كلمات مرور افتراضية ضمن بيانات seed؛ هذا غير مناسب للنشر العام قبل نقل المصادقة إلى الخادم وتخزين كلمات المرور بشكل مجزّأ.
- `lib/data.ts` يرجع تلقائياً إلى مخزن الذاكرة إذا لم يوجد `DATABASE_URL`؛ على Vercel قد يؤدي ذلك إلى فقد البيانات بين عمليات التشغيل، ويجب منع fallback الصامت في Production.
- API المستخدمين يعيد ناتج `listUsers()` مباشرة؛ يجب ألا يعيد أي حقل كلمة مرور أو بيانات اعتماد.

## القرار الفني الموصى به

1. اعتماد الأرشيف المرفق نقطة انطلاق، وعدم إعادة بناء الواجهات من الصفر.
2. الإبقاء على بيانات المشاريع والمواقع والتصنيفات الموجودة، مع توحيد مصدرها المرجعي وعدم استبدالها ببيانات تجريبية.
3. اعتماد PostgreSQL واحد وORM واحد للمسار التنفيذي؛ مواءمة Prisma schema مع نماذج النظام الفعلية، ثم ربط المصادقة به.
4. نقل عمليات القراءة والكتابة من `localStorage` إلى API محمية بالخادم، مع إبقاء `localStorage` فقط لتفضيلات الواجهة غير الحساسة.
5. إزالة أو استبدال مسار workflow التجريبي بعد حسم وظيفة التسجيل، وعدم إضافة حزمة غير مستخدمة لمجرد تجاوز البناء.
6. اختبار تثبيت نظيف، وتوليد Prisma Client، وفحص TypeScript، وبناء Next.js، ثم اختبار الدخول وإنشاء/تعديل العمليات والتقارير والصناديق والإدارة الميدانية والمخزون.
7. بعد نجاح الاختبارات، نشر Preview أولاً، ثم Production على مشروع Vercel واحد فقط، مع الاحتفاظ بالمشاريع الأخرى دون حذف حتى اكتمال التحقق.

## تعديلات الدفعة الأولى المنفذة محلياً
- مواءمة `lib/data.ts` مع جدول `ComplaintOperation` الموجود في Prisma، بدلاً من استدعاء model غير موجود باسم `Complaint`.
- إضافة الحقول والعلاقة المطلوبة في Prisma لتشغيل مسارات API الحالية، وإضافة `name` و`email` و`active` إلى User.
- منع fallback الذاكري الصامت في Production عند غياب `DATABASE_URL`.
- تعديل `listUsers()` ليعيد بيانات آمنة ولا يعيد حقل كلمة المرور.
- نقل مسار Vercel Workflow التجريبي غير المكتمل ومستودع V0 القديم إلى `legacy`، وتنظيف ملفات قفل npm المتعارضة والإبقاء على pnpm.
- توسيع `scripts/verify-project.mjs`، وقد نجح التحقق الثابت: `Project static verification: PASS`.

## ما لم يتم تنفيذه بعد
- لم يتم تغيير أي إعداد إنتاج أو حذف أي مشروع Vercel.
- لم يتم تطبيق migrations على قاعدة بيانات فعلية؛ لا توجد قاعدة Production مؤكدة لهذا التطبيق.
- لم يتم دفع commits إلى GitHub؛ يلزم توفر اتصال GitHub بصلاحية كتابة للمستودع.
- لم يكتمل تثبيت الحزم في بيئة الفحص؛ لذلك لم يصدر تأكيد `typecheck` أو `next build` للنسخة المضغوطة.
- ما زال `StoreProvider` يحفظ العمليات والمخزون والمستخدمين في `localStorage`، وما زال Better Auth يستخدم `pg.Pool`/Kysely بينما البيانات التشغيلية تستخدم Prisma؛ يلزم توحيد مسار الوصول أو توثيق وفصل جداول المصادقة بشكل واضح. يلزم حسم هاتين النقطتين قبل اعتبار النظام جاهزاً للنشر العام.
- لم تُحمَ جميع مسارات API بعد بجلسات وصلاحيات خادمية؛ لذلك لا يجوز اعتبار الدفعة الأولى إصداراً Production-ready.

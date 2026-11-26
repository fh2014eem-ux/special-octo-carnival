# تقرير التنفيذ — CHM-SFD
**التاريخ:** 17 نوفمبر 2026  
**الفرع:** `chm-source-extracted`  
**المستودع:** `fh2014eem-ux/special-octo-carnival`

## 1. حماية المصدر والاستخراج
- تم استخراج أرشيف `CHM-working-checkpoint-2026-11-14-repair-pass1.zip` بنجاح.
- عدد عناصر المصدر المستخرجة: 254 ملفاً/مساراً.
- حُفظت نسخة المصدر المستخرجة في `source-extracted/complaint-management-system-FINAL/`.
- نُسخت ملفات التطبيق إلى جذر الفرع المعزول حتى يتعرف Vercel على تطبيق Next.js.
- نُقلت ملفات npm lock/workspace القديمة والملفات المولدة إلى `legacy/recovery-root-conflicts/` بدلاً من حذفها.
- لم يتم تعديل `main` أو حذف المستودع/الأرشيف أو مشروع Neon القديم.

## 2. الإصلاحات البرمجية المنفذة
- تصحيح مسار استيراد نموذج الشكوى في `app/complaints/new/page.tsx`.
- استبعاد النسخة المحفوظة والمكونات المكررة غير المستخدمة من فحص TypeScript النشط.
- مواءمة Button لدعم خاصية `render` المستخدمة في روابط الواجهة، وإضافة حجم `icon-sm`.
- مواءمة Select مع قيمة `string | null`.
- تصحيح القيمة الابتدائية لحقل FileList.
- استكمال عقد `Operation` بالحقول المستخدمة في نموذج الإدخال متعدد المراحل.
- إضافة نوع صريح لصفوف المستخدمين في طبقة البيانات.
- إنشاء `docs/EXCEL-DATA-DICTIONARY-2026-11-17.md`، وفيه أسماء أوراق المصنف الـ33 وعناوين أعمدتها والمواءمة الأولية.

## 3. نتائج التحقق
على Commit `794673c6f15db57533826021b52ca1d6df9e6526`:
- `pnpm install --frozen-lockfile`: PASS
- `pnpm run db:generate`: PASS
- `node scripts/verify-project.mjs`: PASS
- `pnpm run typecheck`: PASS
- `pnpm run build`: PASS

نشر Vercel Preview المرتبط بالفرع وصل إلى حالة `READY`. اختُبرت صفحات:
`/`, `/complaints`, `/complaints/new`, `/operations`, `/operations/new`, `/reports`, `/alerts`, `/complaint-boxes`, `/corrective-actions`, `/field-activities`, `/monitoring`, `/inventory`, `/users`, `/settings` — وكلها أعادت HTTP 200.

## 4. عوائق التشغيل الحقيقية
- في الفحص الأول لم تكن متغيرات البيئة موجودة. في فحص 17 نوفمبر اللاحق ظهرت أسماء متغيرات تكامل Neon في Vercel، لكن قيم `DATABASE_URL` و`NEON_PROJECT_ID` فارغة؛ لذلك لم يثبت إنشاء قاعدة أو تهيئة اتصال صالح.
- سجّل Vercel runtime الخطأ: «قاعدة البيانات غير مهيأة للإنتاج. يجب ضبط DATABASE_URL وتعطيل USE_MOCK_DATA.» عند طلب `GET /api/complaints`.
- واجهات `/api/complaints` و`/api/reports` و`/api/users` أعادت HTTP 500 في Preview لعدم وجود إعداد اتصال قاعدة البيانات. هذا متوقع لأن طبقة البيانات تمنع الرجوع الصامت إلى الذاكرة في Production.
- مخطط Prisma الحالي يحوي 7 نماذج فقط: `User`, `ComplaintOperation`, `FieldAwareness`, `FieldBox`, `BoxOpeningMinute`, `InventoryItem`, `AuditLog`. ولا يغطي بصورة مستقلة جميع كيانات أوراق Excel الـ33.
- الواجهة التشغيلية ما زالت تعتمد في أجزاء رئيسية على `localStorage` وبيانات seed، كما أن تسجيل الدخول المحلي يقارن كلمة المرور من مخزن المتصفح. لا يجوز اعتماد هذا كآلية مصادقة إنتاجية.
- Better Auth يستخدم Drizzle/pg وجداول مستقلة، بينما مسار بيانات العمليات يستخدم Prisma؛ يلزم توحيد مصدر الهوية وطبقة ORM قبل الترحيل.

## 5. Neon وقرارات الحماية
- ظهرت متغيرات تكامل Neon في مشروع Vercel، مستهدفة Preview وProduction، لكن قيم الاتصال و`NEON_PROJECT_ID` فارغة.
- بحث Neon المباشر عن `chm-sfd-production` وعن `chm` لم يُظهر مشروعاً جديداً. لذلك لا يوجد دليل حتى الآن على إنشاء قاعدة بهذا الاسم.
- المشروع القديم `neon-cyan-car` ما زال موجوداً بمعرف `icy-dust-57856839` ولم نعدّل بياناته.
- يلزم إكمال إنشاء/اختيار مشروع Neon داخل لوحة تكامل Vercel، ثم التحقق من أن قيم الاتصال غير فارغة وأن المشروع هو `chm-sfd-production`.

## 6. فحص النشر الأحدث — 17 نوفمبر 2026
- أحدث Preview للفرع `chm-source-extracted` على commit `832319b30ba295c1b098602253b1141dff5d4f43` حالته `READY`، ومعرف النشر `dpl_8jyz9d9eWWWh86EC9fAB54vU21Y7`.
- الصفحة الرئيسية أعادت HTTP 200 مع HTML عربي RTL، لكن استجابة الخادم الأولية تضمنت حالة تحميل؛ لم يُثبت اختبار تفاعلي كامل للواجهة.
- `GET /api/complaints` أعاد HTTP 500، وسجل Vercel أكد أن `DATABASE_URL` غير مهيأ فعلياً.
- لا توجد migrations أو عمليات كتابة بيانات على Neon.

## 7. الخطوات التالية
1. إتاحة مورد Neon الجديد وربط متغيرات الاتصال دون كشف الأسرار في المستودع.
2. توحيد Better Auth وPrisma وعقد المستخدم/الفرع/الدور.
3. تصميم Prisma models والعلاقات الناقصة بالرجوع إلى قاموس البيانات، خاصة الإحالات والمرفقات والمتابعة والحضور والمخزون وإعدادات النظام وMIS.
4. نقل العمليات من `localStorage` إلى API/قاعدة البيانات تدريجياً مع الحفاظ على وظائف الواجهة.
5. إعداد migrations معتمدة واختبارات قبول وظيفية قبل أي نشر Production.

**حالة الاعتماد:** نجاح البناء والنشر Preview لا يعني اكتمال النظام الوظيفي أو جاهزيته للإنتاج. لم تُنفذ migrations أو تغييرات Production في هذه المرحلة.

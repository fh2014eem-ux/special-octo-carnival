# الأخطاء والتعارضات المؤكدة من الفحص

## A. أخطاء/تعارضات بنيوية
### A1 — Route conflict
يوجد:
- `app/page.tsx`
- `app/(main)/page.tsx`

كلاهما يؤدي إلى `/` لأن `(main)` Route Group. يجب اختيار مسار واحد قبل النسخة التنفيذية.

### A2 — Type contract mismatch
`lib/store.tsx` يستخدم أنواعًا غير معرفة في `lib/types.ts`، ومنها:
`User`, `Operation`, `FieldReport`, `Analysis`, `FollowUp`, `StockMovement`, `StockRequest`, `Responder`.
كما يستخدم Store نماذج عربية/تشغيلية تختلف عن نموذج `Complaint` الموجود في `lib/types.ts`.

### A3 — Data layer duplication
المشروع يجمع localStorage + seed + Prisma + Drizzle + pg + Better Auth. هذا يمنع وجود مصدر واحد موثوق للبيانات.

### A4 — Dependencies mismatch
الكود يستورد حزم غير معلنة في `package.json`، ومنها:
- `swr`
- `better-auth`
- `@prisma/client`
- `drizzle-orm`
- `pg`

### A5 — Lock/workspace duplication
وجود ملفات npm/pnpm متعددة يحتاج قرارًا واحدًا لمدير الحزم قبل التنظيف.

### A6 — Build error masking
`next.config.mjs` يحتوي `typescript.ignoreBuildErrors = true`؛ يجب تعطيله بعد إصلاح أخطاء الأنواع حتى تصبح عملية build اختبارًا حقيقيًا.

## B. مشكلات وظيفية محتملة
- Login المحلي لا يمثل نظام مصادقة مركزيًا.
- بيانات Store قابلة للبقاء في متصفح واحد فقط.
- بعض عناصر navigation تشير إلى محاور لا تملك routes مستقلة.
- بعض المكونات القديمة والجديدة تؤدي وظائف متقاربة.

## C. ما لم يتم الجزم به
لم يتم اعتبار أي ملف «مكررًا وقابلًا للحذف» بمجرد تشابه الاسم. يلزم تتبع الاستيرادات والاستخدام الفعلي ثم نقل/دمج الوظيفة إن كانت مطلوبة.

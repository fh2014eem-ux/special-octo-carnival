# تشغيل النظام على Windows باستخدام Visual Studio Code

## 1. المتطلبات

- Node.js 22 أو أحدث.
- Visual Studio Code.
- حساب Neon إذا أردت قاعدة بيانات حقيقية.

## 2. فتح المشروع

1. فك ضغط ملف المشروع.
2. افتح المجلد في Visual Studio Code.
3. افتح Terminal داخل VS Code.

## 3. تثبيت الحزم

```powershell
npm install
```

سيتم تشغيل `prisma generate` تلقائياً بعد التثبيت.

## 4. إعداد البيئة

انسخ:

`.env.example`

إلى:

`.env.local`

ثم أدخل قيمك الحقيقية.

للتشغيل المحلي:

```text
BETTER_AUTH_URL=http://localhost:3000
```

## 5. فحص الكود

```powershell
npm run typecheck
```

## 6. تشغيل النظام

```powershell
npm run dev
```

ثم افتح:

`http://localhost:3000`

## 7. قاعدة البيانات

بعد ضبط `DATABASE_URL`:

```powershell
npm run db:push
```

ولا تستخدم `db:push` على قاعدة إنتاجية قبل التأكد من المخطط.

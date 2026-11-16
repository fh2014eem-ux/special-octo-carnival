# تشغيل المشروع على Windows + Visual Studio Code

## المتطلبات
- Windows 10/11
- Node.js LTS حديث
- Visual Studio Code
- اتصال إنترنت أثناء تثبيت الحزم
- بيانات اتصال قاعدة Neon عند اعتماد النسخة التنفيذية

## الخطوات
1. فك ضغط النسخة النهائية إلى مجلد مستقل.
2. افتح المجلد في Visual Studio Code.
3. افتح Terminal داخل VS Code.
4. بعد اختيار مدير الحزم النهائي (pnpm في النسخة الحالية المعلنة)، ثبّت Node.js ثم فعّل Corepack إذا لزم.
5. انسخ `.env.example` إلى `.env.local`.
6. ضع بيانات قاعدة البيانات ومفاتيح Better Auth في `.env.local` فقط.
7. ثبّت dependencies.
8. نفّذ migrations/generate حسب schema النهائي.
9. شغّل `dev` وافتح `http://localhost:3000`.

> لا تستخدم ملفات `.env` التي تحتوي أسرارًا حقيقية عند مشاركتها أو رفعها إلى Git.

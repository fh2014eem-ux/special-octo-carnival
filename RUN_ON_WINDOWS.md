# تشغيل نسخة CHM-SFD للاختبار المحلي على Windows + Visual Studio Code

> هذه نسخة مصدر اجتازت فحوصات البناء وTypeScript في CI. لا تُعد بعد نسخة تشغيل إنتاجية معتمدة؛ توجد أعمال متبقية في توحيد المصادقة والبيانات واختبارات قاعدة البيانات.

## المتطلبات
- Windows 10/11
- Node.js 24 LTS
- Visual Studio Code
- اتصال إنترنت لتثبيت الحزم
- قاعدة بيانات محلية أو فرع Neon مخصص للاختبار فقط

## التثبيت
1. فك ضغط ZIP إلى مجلد مستقل.
2. افتح المجلد في Visual Studio Code.
3. افتح Terminal من قائمة Terminal.
4. فعّل Corepack:
   `corepack enable`
5. فعّل إصدار pnpm المحدد بالمشروع:
   `corepack prepare pnpm@12.3.4 --activate`
6. ثبّت الحزم من ملف القفل:
   `pnpm install --frozen-lockfile`
7. انسخ `.env.example` إلى `.env.local`.
8. أدخل بيانات قاعدة اختبار منفصلة وقيمة عشوائية قوية لـ `BETTER_AUTH_SECRET`.
9. أنشئ Prisma Client:
   `pnpm run db:generate`
10. نفّذ فحص TypeScript:
    `pnpm run typecheck`
11. شغّل الخادم:
    `pnpm run dev`
12. افتح `http://localhost:3000`.

## تحذير مهم بشأن قاعدة البيانات
- لا تستخدم قاعدة Neon الإنتاجية في هذا الاختبار.
- لا تنفّذ `pnpm run db:deploy` أو `pnpm run db:push` أو `pnpm run db:migrate` على قاعدة حقيقية حالياً.
- سجل Prisma migrations في فرع التحقق لم تتم تسويته بعد مع التغييرات المنفذة؛ يلزم تدقيقه قبل تطبيق migrations آلياً.
- لا تعتبر نجاح البناء دليلاً على نجاح تسجيل الدخول أو حفظ البيانات.

## حماية الأسرار
- احتفظ بملف `.env.local` على جهازك فقط.
- لا ترفع مفاتيح Google أو كلمات المرور أو روابط قواعد البيانات إلى GitHub.
- لا ترسل ملف `.env.local` في المحادثات أو البريد.

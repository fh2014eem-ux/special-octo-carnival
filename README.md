# نظام إدارة الشكاوى (CHM-SFD)

منصة موحدة لاستقبال شكاوى المواطنين ومعالجتها ومتابعتها حتى الإغلاق، مبنية على
**Next.js 16 (App Router)** و **Prisma ORM** و **PostgreSQL**، بواجهة عربية
(RTL) بالكامل.

## المميزات

- **لوحة تحكم** بإحصائيات مباشرة (إجمالي الشكاوى، قيد المعالجة، نسبة الحل، متوسط زمن الحل).
- **إدارة الشكاوى**: عرض، بحث، تصفية حسب الحالة/الفئة، وتحديث الحالة مباشرة من الجدول.
- **تسجيل شكوى جديدة** مع التحقق من المدخلات على الخادم.
- **التقارير**: توزيع الشكاوى حسب الحالة والأولوية والفئة.
- **مسارات API حقيقية** بدل البيانات الوهمية.
- **تشغيل دون قاعدة بيانات**: عند غياب `DATABASE_URL` يعمل التطبيق تلقائياً على
  مخزن بيانات في الذاكرة ببيانات تجريبية، بحيث تظل الواجهات قابلة للتشغيل والتجربة.

## المتطلبات

- Node.js الإصدار 18.18 أو أحدث (يُفضّل 20+).
- مدير حزم: `npm` (أو `pnpm` / `yarn`).
- قاعدة بيانات PostgreSQL (Neon DB أو Supabase أو خادم محلي) — اختياري للتجربة.

---

## أ) التثبيت والتشغيل المحلي

```bash
# 1) تثبيت الحزم
npm install

# 2) تشغيل خادم التطوير
npm run dev
```

ثم افتح المتصفح على: `http://localhost:3000`

> ملاحظة: بدون ضبط `DATABASE_URL` سيعمل التطبيق مباشرةً على بيانات تجريبية في
> الذاكرة، فيمكنك تجربة كل الشاشات فوراً دون أي إعداد لقاعدة البيانات.

---

## ب) ربط قاعدة البيانات وتشغيل الـ Migrations

### 1) إعداد متغير البيئة

انسخ ملف المثال ثم عدّل رابط الاتصال:

```bash
cp .env.example .env
```

عدّل قيمة `DATABASE_URL` داخل `.env`:

```env
# Neon DB
DATABASE_URL="postgresql://user:password@ep-xxx.aws.neon.tech/dbname?sslmode=require"

# أو Supabase
DATABASE_URL="postgresql://postgres:password@db.xxxxx.supabase.co:5432/postgres"

# أو PostgreSQL محلي
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/complaints?schema=public"
```

### 2) توليد عميل Prisma وإنشاء الجداول

```bash
# توليد Prisma Client
npm run db:generate

# إنشاء الجداول في قاعدة البيانات وتسجيل أول migration
npm run db:migrate

# (اختياري) بذر بيانات تجريبية
npm run db:seed
```

بدائل مفيدة:

```bash
# دفع المخطط للقاعدة دون إنشاء ملفات migration (مناسب للتجربة السريعة)
npm run db:push

# فتح واجهة Prisma Studio لتصفح البيانات
npm run db:studio
```

بمجرد ضبط `DATABASE_URL` بشكل صحيح، ينتقل التطبيق تلقائياً من مخزن الذاكرة إلى
قاعدة البيانات الحقيقية دون أي تغيير في الكود.

### السكربتات المتاحة

| الأمر | الوظيفة |
|------|---------|
| `npm run dev` | تشغيل خادم التطوير |
| `npm run build` | بناء نسخة الإنتاج |
| `npm run start` | تشغيل نسخة الإنتاج |
| `npm run db:generate` | توليد Prisma Client |
| `npm run db:migrate` | إنشاء/تطبيق migrations (تطوير) |
| `npm run db:deploy` | تطبيق migrations (إنتاج) |
| `npm run db:push` | مزامنة المخطط دون migrations |
| `npm run db:seed` | بذر بيانات تجريبية |
| `npm run db:studio` | فتح Prisma Studio |

---

## مسارات الـ API

| الطريقة | المسار | الوظيفة |
|--------|-------|---------|
| `GET` | `/api/complaints?status=&category=&q=` | جلب قائمة الشكاوى مع التصفية |
| `POST` | `/api/complaints` | إضافة شكوى جديدة |
| `GET` | `/api/complaints/[id]` | جلب شكوى واحدة |
| `PATCH` | `/api/complaints/[id]` | تحديث حالة/أولوية/إسناد الشكوى |
| `GET` | `/api/reports` | ملخص إحصائي للتقارير |
| `GET` | `/api/users` | قائمة المستخدمين (للإسناد) |

### مثال: إنشاء شكوى

```bash
curl -X POST http://localhost:3000/api/complaints \
  -H "Content-Type: application/json" \
  -d '{
    "title": "انقطاع الكهرباء",
    "description": "انقطاع متكرر للتيار في الحي منذ يومين",
    "category": "كهرباء ومياه",
    "priority": "HIGH",
    "citizenName": "عبدالله"
  }'
```

---

## ج) التشغيل على سيرفر داخلي أو شبكة محلية (LAN)

### الطريقة 1: تشغيل نسخة الإنتاج مباشرة

```bash
# 1) اضبط DATABASE_URL في .env على قاعدة بيانات داخلية
# 2) طبّق الـ migrations على القاعدة
npm run db:deploy

# 3) ابنِ المشروع
npm run build

# 4) شغّله واجعله متاحاً على كل واجهات الشبكة
#    (‎-H 0.0.0.0‎ يجعل الخادم مرئياً لبقية أجهزة الشبكة المحلية)
npx next start -H 0.0.0.0 -p 3000
```

بعدها يمكن لأي جهاز على نفس الشبكة الوصول عبر عنوان IP الخاص بالسيرفر، مثل:
`http://192.168.1.50:3000`

> لمعرفة عنوان IP للسيرفر: استخدم `ipconfig` على ويندوز أو `ip addr` / `ifconfig`
> على لينكس/ماك. تأكّد من السماح للمنفذ 3000 في جدار الحماية (Firewall).

### الطريقة 2: إبقاء الخدمة تعمل دائماً باستخدام PM2

```bash
npm install -g pm2
npm run build
pm2 start "npx next start -H 0.0.0.0 -p 3000" --name chm-sfd
pm2 save
pm2 startup   # لتشغيل الخدمة تلقائياً عند إقلاع النظام
```

### الطريقة 3: استخدام Docker (اختياري)

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run db:generate && npm run build
EXPOSE 3000
CMD ["npx", "next", "start", "-H", "0.0.0.0", "-p", "3000"]
```

```bash
docker build -t chm-sfd .
docker run -p 3000:3000 --env-file .env chm-sfd
```

### نصائح للتشغيل الداخلي

- **قاعدة البيانات الداخلية**: ثبّت PostgreSQL على السيرفر أو جهاز داخلي، وأنشئ
  قاعدة بيانات مخصصة، ثم وجّه `DATABASE_URL` إليها.
- **جدار الحماية**: افتح المنفذ المستخدم (مثلاً 3000) للشبكة المحلية فقط.
- **البروكسي العكسي**: للوصول عبر منفذ 80/443 واسم مضيف واضح، استخدم Nginx أمام
  التطبيق مع شهادة SSL داخلية.
- **النسخ الاحتياطي**: جدوِل نسخاً احتياطية دورية لقاعدة البيانات (`pg_dump`).
- **متغيرات البيئة للإنتاج**: اضبط `NODE_ENV=production` على السيرفر.

---

## هيكل المشروع

```
app/
  api/
    complaints/route.ts        # GET (قائمة) + POST (إضافة)
    complaints/[id]/route.ts   # GET (واحدة) + PATCH (تحديث)
    reports/route.ts           # GET ملخص التقارير
    users/route.ts             # GET المستخدمين
  complaints/page.tsx          # شاشة قائمة الشكاوى
  complaints/new/page.tsx      # شاشة تسجيل شكوى
  reports/page.tsx             # شاشة التقارير
  page.tsx                     # لوحة التحكم
  layout.tsx                   # التخطيط العام (RTL + الشريط الجانبي)
components/                    # مكوّنات الواجهة
lib/
  prisma.ts                    # عميل Prisma
  data.ts                      # طبقة البيانات (Prisma + رجوع للذاكرة)
  store.ts                     # مخزن الذاكرة + بيانات تجريبية
  types.ts                     # الأنواع والثوابت المشتركة
prisma/
  schema.prisma                # مخطط قاعدة البيانات
  seed.ts                      # بذر بيانات تجريبية
```

## نماذج قاعدة البيانات

- **User** (المستخدمون): `ADMIN` / `AGENT` / `CITIZEN`.
- **Complaint** (الشكاوى): رقم مرجعي، عنوان، وصف، فئة، حالة، أولوية، بيانات مقدم الشكوى، موظف مسؤول.
- **Report** (التقارير): نوع التقرير، الفترة الزمنية، وملخص إحصائي.

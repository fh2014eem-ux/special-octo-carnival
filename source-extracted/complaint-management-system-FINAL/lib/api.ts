// جلب الرابط من متغيرات البيئة
const scriptUrl = process.env.NEXT_PUBLIC_SCRIPT_URL;

// دالة إرسال البيانات إلى Google Apps Script
export async function sendData(data: Record<string, any>) {
  if (!scriptUrl) {
    throw new Error('NEXT_PUBLIC_SCRIPT_URL غير محدد في متغيرات البيئة');
  }

  const response = await fetch(scriptUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(data),
  });

  return response.json();
}
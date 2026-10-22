import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET() {
  try {
    // مسار ملف قاعدة البيانات (بناءً على إعدادات Prisma)
    const dbPath = path.join(process.cwd(), "prisma", "dev.db");
    
    // التحقق من وجود الملف
    if (!fs.existsSync(dbPath)) {
      return NextResponse.json({ error: "ملف قاعدة البيانات غير موجود" }, { status: 404 });
    }

    const fileBuffer = fs.readFileSync(dbPath);
    
    return new NextResponse(fileBuffer, {
      headers: {
        "Content-Disposition": `attachment; filename="nabd-backup-${new Date().toISOString().split('T')[0]}.db"`,
        "Content-Type": "application/octet-stream",
      },
    });
  } catch (error) {
    return NextResponse.json({ error: "حدث خطأ أثناء إنشاء النسخة الاحتياطية" }, { status: 500 });
  }
}
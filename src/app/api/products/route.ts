import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    return NextResponse.json(products);
  } catch (error) {
    return NextResponse.json({ error: "فشل جلب المنتجات" }, { status: 500 });
  }
}
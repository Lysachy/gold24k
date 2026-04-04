import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [total, available, sold] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "available" } }),
      prisma.product.count({ where: { status: "sold" } }),
    ]);

    return NextResponse.json({ total, available, sold });
  } catch (error) {
    console.error("GET /api/products/stats error:", error);
    return NextResponse.json({ total: 0, available: 0, sold: 0 });
  }
}

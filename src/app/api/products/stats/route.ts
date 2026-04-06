import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const [total, available, sold, soldProducts] = await Promise.all([
      prisma.product.count(),
      prisma.product.count({ where: { status: "available" } }),
      prisma.product.count({ where: { status: "sold" } }),
      prisma.product.findMany({
        where: { status: "sold" },
        orderBy: { updatedAt: "desc" },
      }),
    ]);

    const totalRevenue = soldProducts.reduce((sum, p) => sum + p.price, 0);

    return NextResponse.json({ total, available, sold, totalRevenue, soldProducts });
  } catch (error) {
    console.error("GET /api/products/stats error:", error);
    return NextResponse.json({ total: 0, available: 0, sold: 0, totalRevenue: 0, soldProducts: [] });
  }
}

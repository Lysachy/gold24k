import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const category = searchParams.get("category") || "";
    const status = searchParams.get("status") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { sku: { contains: search, mode: "insensitive" } },
      ];
    }
    if (category) where.category = category;
    if (status) where.status = status;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      total,
      pages: Math.ceil(total / limit),
      page,
    });
  } catch (error) {
    console.error("GET /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (!body.name || !body.sku || !body.category) {
      return NextResponse.json(
        { error: "Name, SKU, and category are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.product.findUnique({
      where: { sku: body.sku },
    });
    if (existing) {
      return NextResponse.json(
        { error: "SKU already exists" },
        { status: 409 }
      );
    }

    const product = await prisma.product.create({
      data: {
        name: body.name,
        sku: body.sku,
        category: body.category,
        material: body.material || null,
        purity: body.purity || null,
        weight: body.weight ? parseFloat(body.weight) : null,
        price: body.price ? parseFloat(body.price) : 0,
        description: body.description || null,
        imageUrl: body.imageUrl || null,
        status: body.status || "available",
      },
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    console.error("POST /api/products error:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

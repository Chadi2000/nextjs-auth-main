import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, description, limit, page } = body;

    const pageNumber = parseInt(page) || 1;
    const limitNumber = parseInt(limit) || 10;

    const skip = (pageNumber - 1) * limitNumber;

    const categories = await db.category.findMany({
      skip,
      take: limitNumber,
      where: {
        ...(name && { name: { contains: name, mode: "insensitive" } }),
        ...(description && { description: { contains: description, mode: "insensitive" } })
      },
      orderBy: { category_id: "desc" },
    });

    const total = await db.category.count({
      where: {
        ...(name && { name: { contains: name, mode: "insensitive" } }),
        ...(description && { description: { contains: description, mode: "insensitive" } })
      }
    });

    return NextResponse.json(
      {
        success: true,
        data: categories,
        meta: {
          total,
          page: pageNumber,
          limit: limitNumber,
          totalPages: Math.ceil(total / limitNumber),
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching categories:", err);
    return NextResponse.json(
      { success: false, message: "Failed to get categories" },
      { status: 500 }
    );
  }
}

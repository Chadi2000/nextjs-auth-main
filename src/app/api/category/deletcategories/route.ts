import { db } from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { ids } = await req.json(); 
    if (!ids || ids.length === 0) {
      return NextResponse.json(
        { success: false, message: "No category IDs provided" },
        { status: 400 }
      );
    }

    const response = await db.category.deleteMany({
      where: {
        category_id: {
          in: ids,
        },
      },
    });

    return NextResponse.json(
      { success: true, deletedCount: response.count },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
  }
}

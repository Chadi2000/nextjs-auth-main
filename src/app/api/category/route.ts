import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import * as z from 'zod'

const categorySchema = z
  .object({
    name: z.string().min(1, 'Name Is Required').max(20),
    description: z.string().min(1, 'Description is required').max(100)
  })

const paginationSchema = z.object({
    page:z.number(),
    limt: z.number()
})

export async function POST(req: Request) {
  try {

    const json = await req.json();
    const parsed = categorySchema.safeParse(json);

    if (!parsed.success) {
      return NextResponse.json(
        { message: "Validation Failed", errors: parsed.error.format() },
        { status: 400 }
      );
    }

    const { name, description } = parsed.data;
    const newCategory = await db.category.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Category Added Successfully",
        category: newCategory,
      },
      { status: 200 }
    );
  } catch (err: any) {
    return NextResponse.json(
      { message: "Internal Server Error", error: err.message },
      { status: 500 }
    );
  }
}






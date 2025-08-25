import { db } from "@/lib/db"
import { NextResponse } from "next/server"

export async function GET(
    req: Request,
  { params }: { params: { id: string } }
) {
   try{
    const {id} = params

    let category = await db.category.findUnique({
        where:{
            category_id: parseInt(id)
        }
    })
    if (!category) {
      return NextResponse.json(
        { success: false, message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, category },
      { status: 200 }
    );

   } catch(err){
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
   }
}

export async function PUT(
    req:Request,
    { params }: { params: { id: string } }
) {
    try{
        const {id} = params
        const body = await req.json()
        const category = await db.category.update({
            where: {
                category_id: parseInt(id),
            },
            data: {
                ...body,
            },
        });

        return NextResponse.json(
            {success: true, category},
            {status: 200}
        )

    }catch(err){
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    );
   }
}
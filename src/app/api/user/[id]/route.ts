import { db } from "@/lib/db"
import { NextResponse } from "next/server"


export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await db.user.delete({
      where: {
        id: params.id,
      },
    })

    return NextResponse.json({
      success: true,
      message: 'User deleted successfully',
    })
  } catch (err) {
    return NextResponse.json(
      {
        success: false,
        message: `Failed To Delete User: ${err}`,
      },
      { status: 500 }
    )
  }
}


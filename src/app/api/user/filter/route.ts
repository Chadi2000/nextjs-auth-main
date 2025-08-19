import { db } from "@/lib/db";
import { NextResponse } from "next/server";


export async function POST(req:Request) {

  const body = await req.json();
  console.log(body)
  const { email, phoneNumber } = body;


  const usersRaw = await db.user.findMany({
    where: {
    ...(email && {
        email: {
        endsWith: 'gmail.com',
        equals: email
        }
    }),
    ...(phoneNumber !=="" && {
        phoneNumber: {
        equals: phoneNumber
        }
    })
    }
  });

  const users = usersRaw.map(({ password, ...rest }) => rest);
  
  return NextResponse.json(
    { data: users, success: true },
    { status: 200 }
  );
}
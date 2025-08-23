import ClientUserComponent from '@/components/client/user/Users';
import { toast } from '@/hooks/use-toast';
import { db } from '@/lib/db';
import React from 'react'

async function page() {
      const usersRaw = await db.user.findMany({
        where:{
          role: "member"
        }
      });
     
      const users = usersRaw.map(({ password, ...rest }) => rest);
  return (
    <div>
        <ClientUserComponent users={users} />
    </div>
  )
}

export default page
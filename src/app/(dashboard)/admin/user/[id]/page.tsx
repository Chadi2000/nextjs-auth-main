import ClientUserDetailsComponent from '@/components/client/UserDetails'
import { db } from '@/lib/db'
import React from 'react'

export default async function Page({ params }: { params: { id: string } }) {
  const userInformation = await db.user.findUnique({
    where: {
      id: params.id,
    },
  })

  if (!userInformation) {
    return <div>User not found</div>
  }

  return (
    <div>
      <ClientUserDetailsComponent user={userInformation} />
    </div>
  )
}

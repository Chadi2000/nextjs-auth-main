import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import React from 'react'

async function page() {
    const session = await getServerSession(authOptions)
    if (session?.user) {
        return <h2 className='text-2xl'>Admin Page - Welcome back {session?.user.username || session?.user.name}</h2>
    } else {
        return <h2>Please login to see this admin page</h2>
    }


}

export default page
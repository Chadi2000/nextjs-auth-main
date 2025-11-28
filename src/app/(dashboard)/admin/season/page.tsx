import SeasonClientComponent from '@/components/client/season/SeasonClientComponent';
import { db } from '@/lib/db'
import React from 'react'

async function page() {
   const limitNumber = 10;
  const seasons = await db.season.findMany({
    orderBy:{
      season_id:"desc"
    }
  })

  const total = await db.season.count()
  const totalPages = Math.ceil(total/limitNumber);

  return (
    <div>
      <SeasonClientComponent seasons={seasons} totalSeasons={total} totalPages={totalPages} />
    </div>
  )
}

export default page
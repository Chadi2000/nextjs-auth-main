import { Prisma } from '@prisma/client'
import React from 'react'
import { db } from '@/lib/db'
import CategoriesComponent from '@/components/client/category/Categories'

async function page() {
    const categories = await db.category.findMany({
      orderBy:{
        category_id:'desc'
      }
    })
  return (
    <div>
      <CategoriesComponent categories={categories} />
    </div>
  )
}

export default page
import { Prisma } from '@prisma/client'
import React from 'react'
import { db } from '@/lib/db'
import CategoriesComponent from '@/components/client/category/Categories'

async function page() {
  const pageNumber = 1;
    const limitNumber = 10;
    const skip = (pageNumber - 1) * limitNumber;

    const categories = await db.category.findMany({
      skip,
      take:limitNumber,
      orderBy:{
        category_id:'desc'
      }
    })
    const total = await db.category.count({});
    const totalPages = Math.ceil(total/limitNumber);
  return (
    <div>
      <CategoriesComponent categories={categories} totalCategories={total} totalPages={totalPages} />
    </div>
  )
}

export default page
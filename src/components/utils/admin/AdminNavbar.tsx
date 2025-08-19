'use client'
import React from 'react'
import Link from 'next/link'
import { FaAngleRight } from "react-icons/fa";

type AdminNavbarProps = {
  text: string
  url: string
  active?: boolean
}

function AdminNavbar({ text, url, active = false }: AdminNavbarProps) {
  return (
    <Link
      href={url}
      className={`rounded-md w-full h-12 flex items-center justify-between px-4 mb-2 transition-colors 
        ${active ? 'bg-red-600 text-white font-bold' : 'bg-white text-black hover:bg-red-600 hover:text-white'}`}
    >
      <span>{text}</span>
      {active && <FaAngleRight size={20} />}
    </Link>
  )
}

export default AdminNavbar

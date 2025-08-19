'use client';

import React from 'react';
import AdminNavbar from './AdminNavbar';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import Logo from '../../../../public/logo.png';

function LeftNavbar() {
  const pathName = usePathname();

  return (
    <nav
      className="bg-black border-end p-4 flex flex-col items-start gap-6"
      style={{ width: '20vw', minHeight: '100vh' }}
    >
      {/* Logo and Title */}
      <div className="flex items-center gap-2">
        <Image
          src={Logo}
          alt="Logo"
          width={40}
          height={40}
          className="rounded"
        />
        <span className="text-white text-sm font-semibold leading-tight">
          WinnerForce Admin
        </span>
      </div>

      {/* Divider */}
      <hr className="w-full border-gray-700" />

      {/* Navigation Links */}
      <div className="flex flex-col gap-3 w-full">
        <AdminNavbar
          active={pathName === '/admin'}
          text="Dashboard"
          url="/admin"
        />
        <AdminNavbar
          active={pathName === '/admin/user' || pathName.includes('/admin/user')}
          text="Users"
          url="/admin/user"
        />
        <AdminNavbar
          active={pathName === '/admin/admin' || pathName.includes('/admin/admin')}
          text="Admins"
          url="/admin/admin"
        />
         <AdminNavbar
          active={pathName === '/admin/co-admin' || pathName.includes('/admin/co-admin')}
          text="CO Admins"
          url="/admin/co-admin"
        />
        <AdminNavbar
          active={pathName === '/admin/category' || pathName.includes('/admin/category')}
          text="Categories"
          url="/admin/category"
        />
         <AdminNavbar
          active={pathName === '/admin/product' || pathName.includes('/admin/product')}
          text="Products"
          url="/admin/product"
        />
        <AdminNavbar
          active={pathName === '/admin/season' || pathName.includes('/admin/season') }
          text="Seasons"
          url="/admin/season"
        />
        {/* Add more links here as needed */}
      </div>
    </nav>
  );
}

export default LeftNavbar;

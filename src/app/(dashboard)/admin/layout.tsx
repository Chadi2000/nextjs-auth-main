// app/admin/layout.tsx
import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import LeftNavbar from '@/components/utils/admin/LeftNavbar';


export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex bg-gray-100" style={{ minHeight: '100vh' }}>
     <LeftNavbar />

      <main className="flex-grow-1 p-4" style={{width: '80vw'}}>
        {children}
      </main>
    </div>
  );
}

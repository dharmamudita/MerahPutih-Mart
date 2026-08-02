'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

export default function AuthGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // For dev testing, auto-set dummy token if none exists
    if (!localStorage.getItem('token')) {
      localStorage.setItem('token', 'dev-super-admin-token');
    }
    setChecked(true);
  }, [pathname, router]);

  if (pathname === '/login') return children;
  if (!checked) return null;

  return children;
}

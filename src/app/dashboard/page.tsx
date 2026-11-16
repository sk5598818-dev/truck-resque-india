'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/garage-dashboard');
  }, [router]);

  return (
    <div className="py-20 text-center text-slate-400 text-sm">
      Forwarding to Garage Management Dashboard...
    </div>
  );
}

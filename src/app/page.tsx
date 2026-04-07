'use client';

import dynamic from 'next/dynamic';

const Calendar = dynamic(() => import('@/components/Calendar'), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#0f172a]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 border-4 border-blue-400/30 border-t-blue-400 rounded-full animate-spin" />
        <p className="text-white/40 text-sm font-medium tracking-wide">Loading calendar...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  return <Calendar />;
}

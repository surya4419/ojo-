'use client';

import { Download } from 'lucide-react';
import dynamic from 'next/dynamic';

const DownloadProfilePDF = dynamic(() => import('./DownloadProfilePDF'), { 
  ssr: false,
  loading: () => (
    <div className="group relative p-8 rounded-2xl bg-black/40 backdrop-blur-sm border border-white/10">
      <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-emerald-500/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
      <Download className="w-12 h-12 text-green-400 mb-4 animate-pulse" />
      <h3 className="text-xl font-semibold text-white mb-2">Download PDF</h3>
      <p className="text-gray-400">Loading PDF generator...</p>
    </div>
  )
});

interface DownloadProfilePDFClientProps {
  profileId: string;
  profileName: string;
}

export default function DownloadProfilePDFClient({ 
  profileId, 
  profileName 
}: DownloadProfilePDFClientProps) {
  return (
    <div className="group relative">
      <DownloadProfilePDF profileId={profileId} profileName={profileName} />
    </div>
  );
}
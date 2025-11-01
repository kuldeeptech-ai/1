'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import type { DownloadLink } from '@/lib/types';
import { DownloadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';

interface DownloadButtonProps {
  link: DownloadLink;
}

export function DownloadButton({ link }: DownloadButtonProps) {
  return (
    <Button
      asChild
      variant="secondary"
      style={{ minWidth: '225px' }}
      className={cn(
        'relative overflow-hidden group h-auto w-full flex-row items-center justify-center p-3 text-center transition-transform hover:scale-105 mb-5',
        'bg-gradient-to-r from-purple-500 to-indigo-600 text-white',
        'shadow-lg shadow-purple-500/30 hover:shadow-indigo-500/50',
        'flex items-center gap-2'
        )}
    >
      <Link href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
        <div className="absolute inset-0 w-full h-full bg-white opacity-0 transition-opacity duration-300 group-hover:opacity-10" />
        <DownloadCloud className="h-5 w-5 text-white" />
        <span className="text-xs font-semibold leading-tight text-white break-words whitespace-normal z-10">
          {link.title}
        </span>
      </Link>
    </Button>
  );
}

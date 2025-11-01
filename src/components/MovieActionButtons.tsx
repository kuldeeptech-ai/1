'use client';

import { Button } from '@/components/ui/button';
import { Download, Eye, Share2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface MovieActionButtonsProps {
  movieTitle: string;
  hasDownloads?: boolean;
  watchUrl?: string;
}

export function MovieActionButtons({
  movieTitle,
  hasDownloads,
  watchUrl,
}: MovieActionButtonsProps) {
  const { toast } = useToast();

  const handleScrollClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    if (sectionId.startsWith('#')) {
      e.preventDefault();
      const targetId = sectionId.substring(1);
      const targetElement = document.getElementById(targetId);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const handleShareClick = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: movieTitle,
          text: `Check out ${movieTitle}!`,
          url: window.location.href,
        });
      } catch (error) {
        console.error('Error sharing:', error);
        toast({
            variant: 'destructive',
            title: 'Sharing failed',
            description: 'The content could not be shared.',
        });
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: 'Link Copied!',
        description: 'The page URL has been copied to your clipboard.',
      });
    }
  };
  
  return (
    <div className="mt-6 flex flex-wrap items-center gap-3">
      {hasDownloads && (
        <Button
          onClick={() => {
            const downloadSection = document.getElementById('download-section');
            if (downloadSection) {
              downloadSection.scrollIntoView({ behavior: 'smooth' });
            }
          }}
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg transition-transform hover:scale-105 px-4 md:px-8"
        >
          <Download className="mr-2 h-5 w-5" />
          Download
        </Button>
      )}
      {watchUrl && (
        <Button asChild variant="outline" className="border-green-500/50 text-green-400 hover:bg-green-500/10 hover:text-green-300 px-4 md:px-8">
           <Link href={watchUrl} onClick={(e) => handleScrollClick(e, watchUrl)}>
            <Eye className="mr-2 h-5 w-5" />
            Watch
           </Link>
        </Button>
      )}
      <Button onClick={handleShareClick} variant="outline" size="icon" className="h-11 w-11">
        <Share2 className="h-5 w-5" />
        <span className="sr-only">Share</span>
      </Button>
    </div>
  );
}

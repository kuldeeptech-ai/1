
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import type { Movie } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MovieCardProps {
  movie: Movie;
  className?: string;
}

export function MovieCard({ movie, className }: MovieCardProps) {
  const movieSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": movie.title,
    "image": movie.imageUrl,
    "author": {
      "@type": "Organization",
      "name": "hdlove4u"
    },
    "publisher": {
        "@type": "Organization",
        "name": "hdlove4u"
    }
  };

  const fullImageUrl = movie.imageUrl.startsWith('http') ? movie.imageUrl : `https://vegamovies.you${movie.imageUrl}`;

  return (
    <Link href={`/movie${movie.path.startsWith('/') ? movie.path : `/${movie.path}`}`} className={cn('group block', className)} prefetch={false}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(movieSchema) }}
      />
      <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50">
        <CardContent className="p-0">
          <div className="relative aspect-[2/3] w-full">
            <img
              src={fullImageUrl}
              alt={movie.title}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
              loading="lazy"
            />
             <div className="absolute inset-0"></div>
          </div>
          <div className="p-2">
            <h3 className="font-body text-sm font-semibold text-foreground">
              {movie.title}
            </h3>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}

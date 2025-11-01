
import { notFound } from 'next/navigation';
import { AlertCircle, Calendar, Star, Tag } from 'lucide-react';
import Link from 'next/link';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { getMovieDetails } from '@/lib/actions';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { DownloadButton } from '@/components/DownloadButton';
import { MovieActionButtons } from '@/components/MovieActionButtons';
import type { Metadata } from 'next';
import type { DownloadLink } from '@/lib/types';
import { ScreenshotGallery } from '@/components/ScreenshotGallery';
import { RecentPosts } from '@/components/RecentPosts';

const DetailItem = ({ label, value }: { label: string, value?: string | React.ReactNode }) => {
  if (!value) return null;
  return (
    <div className="flex flex-row gap-2">
      <p className="w-28 flex-shrink-0 font-semibold text-muted-foreground">{label}:</p>
      <div className="font-medium text-foreground">{value}</div>
    </div>
  );
};

export async function generateMetadata({ params }: { params: { slug: string[] } }): Promise<Metadata> {
    const path = params.slug.join('/');
    const details = await getMovieDetails(path);
  
    if (!details) {
      return {
        title: 'Not Found',
      };
    }

    return {
      title: `${details.title} - hdlove4u`,
      description: details.description,
      openGraph: {
        title: `${details.title} - hdlove4u`,
        description: details.description,
        images: [details.imageUrl],
        type: 'video.movie',
        url: `/movie/${path}`
      },
      twitter: {
        card: 'summary_large_image',
        title: `${details.title} - hdlove4u`,
        description: details.description,
        images: [details.imageUrl],
      },
    };
  }

export default async function MoviePage({ params }: { params: { slug: string[] } }) {
  const path = params.slug.join('/');
  const details = await getMovieDetails(path);

  if (!details) {
    notFound();
  }
  
  const hasDownloads = details.downloadLinks && details.downloadLinks.length > 0;
  const watchUrl = details.imdbId ? `#watch-section` : undefined;

  const groupedLinks = details.downloadLinks.reduce((acc, link) => {
    const group = link.groupTitle || 'Downloads';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(link);
    return acc;
  }, {} as Record<string, DownloadLink[]>);

  return (
    <>
      <div className="container mx-auto max-w-6xl px-4 py-8">
        <div className="flex flex-row gap-4 md:gap-8">
          <div className="w-[100px] flex-shrink-0 md:w-1/3 lg:w-1/4">
               <Dialog>
                <DialogTrigger asChild>
                  <div className="relative aspect-[2/3] w-full cursor-pointer overflow-hidden rounded-xl shadow-2xl shadow-primary/10 transition-transform hover:scale-105">
                    <img
                      src={details.imageUrl}
                      alt={details.title}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </DialogTrigger>
                <DialogContent className="max-w-3xl border-0 bg-transparent p-0 overflow-hidden">
                  <img
                    src={details.imageUrl}
                    alt={details.title}
                    className="h-auto w-full max-h-[90vh] object-contain"
                  />
                </DialogContent>
              </Dialog>
          </div>
          <div className="flex w-full flex-col">
            <h1 className="font-headline text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {details.title}
            </h1>
            
            <div className="mt-2 flex flex-wrap items-center gap-1">
              {details.category?.split(',').map(cat => {
                const cleanedCat = cat.trim();
                const categoryPath = `/category/${cleanedCat.toLowerCase().replace(/ /g, '-')}`;
                if (!cleanedCat) return null;
                return (
                  <Link href={categoryPath} key={cleanedCat} prefetch={false}>
                    <Badge variant="outline" className="transition-colors hover:bg-primary/20 hover:border-primary/50 cursor-pointer text-xs">
                      <Tag className="mr-1 h-3 w-3" />
                      {cleanedCat}
                    </Badge>
                  </Link>
                )
              })}
            </div>
            
             <div className="mt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-4">
                  {details.releaseDate && (
                    <div className="flex items-center gap-2 rounded-lg transition-colors">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Calendar className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-muted-foreground">Release Date</p>
                        <div className="text-sm font-medium text-foreground">{details.releaseDate}</div>
                      </div>
                    </div>
                  )}
                </div>
                <MovieActionButtons 
                    movieTitle={details.title}
                    hasDownloads={hasDownloads}
                    watchUrl={watchUrl}
                  />
            </div>
          </div>
        </div>

        <div className="mt-8">
            { (details.rating || details.year || details.language) && (
              <>
                 <div className="space-y-3 rounded-lg border bg-card/50 p-4 text-sm">
                    <h3 className="font-headline text-lg font-semibold text-foreground mb-3">Movie Info</h3>
                    <DetailItem label="IMDb Rating" value={details.rating} />
                    <DetailItem label="Movie Name" value={details.title_from_info} />
                    <DetailItem label="Release Year" value={details.year} />
                    <DetailItem label="Language" value={details.language} />
                    <DetailItem label="Size" value={details.size} />
                    <DetailItem label="Format" value={details.format} />
                    <DetailItem label="Runtime" value={details.duration} />
                    <DetailItem label="Quality" value={details.quality} />
                    <DetailItem label="Genres" value={details.category} />
                    <DetailItem label="Writers" value={details.writers} />
                    <DetailItem label="Cast" value={details.stars} />
                    <DetailItem label="Director" value={details.director} />
                 </div>
              </>
            )}
            
             {details.tags && details.tags.length > 0 && (
              <>
                <Separator className="my-6" />
                <div>
                  <h3 className="font-headline text-lg font-semibold text-foreground mb-3">Tags</h3>
                  <div className="flex flex-wrap gap-2">
                    {details.tags.map(tag => (
                       <Link href={`/search?q=${encodeURIComponent(tag)}`} key={tag}>
                          <Badge variant="secondary" className="cursor-pointer hover:bg-primary/20">
                            {tag}
                          </Badge>
                       </Link>
                    ))}
                  </div>
                </div>
              </>
            )}
        </div>
      </div>
      
      {details.screenshots && details.screenshots.length > 0 && (
           <div className="w-full">
             <Separator className="my-8" />
             <div className="container mx-auto max-w-6xl px-4 mb-6 text-center">
             </div>
             <ScreenshotGallery screenshots={details.screenshots} />
           </div>
      )}

      <div id="download-section" className="container mx-auto max-w-6xl px-4 py-8 w-full">
          <Separator className="my-8" />
          
          {details.imdbId && (
            <div id="watch-section" className="mt-8 mb-8">
              <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                Watch Now
              </h2>
              <div className="aspect-video w-full overflow-hidden rounded-lg bg-black">
                <iframe
                  src={`https://vidsrc.to/embed/movie/${details.imdbId}`}
                  title={`${details.title} Player`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="h-full w-full"
                ></iframe>
              </div>
            </div>
          )}

          {hasDownloads ? (
            Object.entries(groupedLinks).map(([groupTitle, links]) => (
              <div key={groupTitle} className="mt-8">
                <h2 className="font-headline text-[13px] font-semibold text-foreground text-center">
                  {groupTitle}
                </h2>
                <div className="mt-4 flex flex-col items-center">
                  {links.map((link) => (
                    <DownloadButton key={link.url} link={link} />
                  ))}
                </div>
              </div>
            ))
          ) : (
             <div className="mt-8 flex h-32 items-center justify-center rounded-lg border-2 border-dashed border-muted">
                 <p className="text-muted-foreground">No download links found.</p>
             </div>
           )}
           
           {details.paragraphs && details.paragraphs.length > 0 && (
            <>
                <Separator className="my-8" />
                <div>
                  <h2 className="font-headline text-2xl font-semibold text-foreground mb-4">
                    Storyline
                  </h2>
                  <div className="mt-4 font-body text-sm leading-relaxed text-muted-foreground md:text-base md:leading-7 space-y-4">
                    {details.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
                  </div>
                </div>
            </>
           )}

           <Separator className="my-8" />
           <RecentPosts />
        </div>
    </>
  );
}

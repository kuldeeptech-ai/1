
'use client';

interface ScreenshotGalleryProps {
  screenshots: string[];
}

export function ScreenshotGallery({ screenshots }: ScreenshotGalleryProps) {
  return (
    <div className="mt-12">
      <div className="mb-6 text-center">
        <h2 className="font-headline text-2xl font-semibold text-foreground">
          Screenshots
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        {screenshots.map((src, index) => (
          <div key={index} className="w-full overflow-hidden rounded-lg">
            <img
              src={src}
              alt={`Screenshot ${index + 1}`}
              className="h-auto w-full object-contain"
              loading="lazy"
            />
          </div>
        ))}
      </div>
    </div>
  );
}

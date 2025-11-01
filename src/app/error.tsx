'use client' // Error components must be Client Components
 
import { useEffect } from 'react'
import { Button } from '@/components/ui/button';
 
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])
 
  return (
    <div className="container mx-auto flex h-[calc(100vh-8rem)] flex-col items-center justify-center text-center">
      <h2 className="mb-4 font-headline text-2xl font-bold text-destructive">Something went wrong!</h2>
      <p className="mb-6 max-w-md text-muted-foreground">
        An unexpected error occurred. This might be a temporary issue with the application or the source website. You can try again.
      </p>
      <Button
        onClick={
          // Attempt to recover by trying to re-render the segment
          () => reset()
        }
      >
        Try again
      </Button>
    </div>
  )
}

import { Suspense } from 'react';
import { NotFoundContent } from '@/components/NotFoundContent';

export const dynamic = "force-dynamic";

export default function NotFound() {
  return (
    <Suspense fallback={<div className="container mx-auto px-3 py-8 text-center text-white">Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}

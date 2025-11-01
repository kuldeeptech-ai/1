import { Clapperboard } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2" prefetch={false}>
      <Clapperboard className="h-7 w-7 text-primary" />
      <span className="text-xl font-bold font-headline text-foreground md:inline">
       Hdlove4u
      </span>
    </Link>
  );
}

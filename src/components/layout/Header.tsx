import Link from 'next/link';
import { getCategories } from '@/lib/actions';
import { Logo } from './Logo';
import { ThemeToggle } from './ThemeToggle';
import { Suspense } from 'react';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { ChevronDown, Menu } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ScrollArea } from '../ui/scroll-area';
import { SearchModal } from './SearchModal';
import { InstallButton } from './InstallButton';
import { Separator } from '../ui/separator';

export async function Header() {
  const categories = await getCategories();
  const mainCategories = categories.slice(0, 7);
  const moreCategories = categories.slice(7);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center px-4">
        <div className="mr-4 hidden flex-1 md:flex">
          <Logo />
        </div>
        
        {/* Mobile Header */}
        <div className="flex flex-1 items-center md:hidden">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Open Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="pr-0">
                <div className="flex items-center mb-6 pl-6">
                    <Logo />
                </div>
              <ScrollArea className="h-[calc(100vh-8rem)]">
                <div className="flex flex-col space-y-2 pl-6">
                  {mainCategories.map((category) => (
                    <Link
                        key={category.path}
                        href={category.path}
                        className="text-[15px] font-medium text-foreground/80 transition-colors hover:text-foreground"
                        prefetch={false}
                    >
                        {category.name}
                    </Link>
                  ))}
                  {moreCategories.length > 0 && (
                    <>
                        <Separator className="my-4" />
                        <p className="font-semibold text-muted-foreground">More</p>
                        {moreCategories.map((category) => (
                             <Link
                                key={category.path}
                                href={category.path}
                                className="text-[15px] font-medium text-foreground/80 transition-colors hover:text-foreground"
                                prefetch={false}
                            >
                                {category.name}
                            </Link>
                        ))}
                    </>
                  )}
                </div>
              </ScrollArea>
            </SheetContent>
          </Sheet>
          <div className="flex flex-1 justify-center">
            <Logo />
          </div>
        </div>

        {/* Desktop Header */}
        <nav className="hidden md:flex flex-1 items-center space-x-6 text-sm font-medium">
          {mainCategories.map((category) => (
            <Link
              key={category.path}
              href={category.path}
              className="whitespace-nowrap transition-colors hover:text-foreground/80 text-foreground/60"
              prefetch={false}
            >
              {category.name}
            </Link>
          ))}
          {moreCategories.length > 0 && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-foreground/60 focus:bg-accent">
                  More
                  <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56">
                {moreCategories.map((category) => (
                  <DropdownMenuItem key={category.path} asChild>
                    <Link href={category.path} prefetch={false}>
                      {category.name}
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </nav>

        <div className="flex flex-shrink-0 items-center justify-end gap-2">
          <Suspense fallback={<div className="h-10 w-10"></div>}>
             <SearchModal />
          </Suspense>
          <InstallButton />
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

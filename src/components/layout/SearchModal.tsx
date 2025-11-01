
'use client';

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
  } from '@/components/ui/dialog';
import { Search } from 'lucide-react';
import { Button } from '../ui/button';
import { SearchBar } from './SearchBar';

export function SearchModal() {

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Search className="h-5 w-5" />
                    <span className="sr-only">Search</span>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Search for Movies and Series</DialogTitle>
                </DialogHeader>
                <SearchBar />
            </DialogContent>
        </Dialog>
    )
}

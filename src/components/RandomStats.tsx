'use client';

import { useEffect, useState } from 'react';
import { Eye, MessageCircle } from 'lucide-react';

function formatNumber(num: number): string {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

export function RandomStats() {
    const [stats, setStats] = useState<{ views: number | null; comments: number | null }>({
        views: null,
        comments: null,
    });

    useEffect(() => {
        // Generate random numbers for views (between 50k and 5M)
        // and comments (between 500 and 50k)
        const views = Math.floor(Math.random() * (5000000 - 50000 + 1)) + 50000;
        const comments = Math.floor(Math.random() * (50000 - 500 + 1)) + 500;
        
        setStats({ views, comments });
    }, []);

    return (
        <div className="mt-4 flex items-center gap-6 text-sm text-muted-foreground">
            {stats.views !== null && (
                 <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{formatNumber(stats.views)} views</span>
                </div>
            )}
             {stats.comments !== null && (
                <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4" />
                    <span>{formatNumber(stats.comments)} comments</span>
                </div>
            )}
        </div>
    );
}

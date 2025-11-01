import { getRecentPosts } from '@/lib/actions';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { List } from 'lucide-react';

export async function RecentPosts() {
  const posts = await getRecentPosts();

  if (!posts || posts.length === 0) {
    return null;
  }

  return (
    <Card className="bg-background/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-xl">
          <List className="h-5 w-5" />
          Recent Posts
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="list-disc space-y-2 pl-5">
          {posts.map((post) => (
            <li key={post.path} className="text-sm text-muted-foreground transition-colors hover:text-foreground">
              <Link href={`/movie${post.path}`} prefetch={false}>
                {post.title}
              </Link>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

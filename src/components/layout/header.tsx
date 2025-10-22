import Link from 'next/link';
import { Icons } from '@/components/icons';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '../theme-toggle';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/" className="flex items-center space-x-2">
            <Icons.Logo />
          </Link>
        </div>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          {/* Add more nav links here if needed */}
        </nav>
        <div className="flex flex-1 items-center justify-end space-x-4">
           <Link href="/admin">
            <Button variant="ghost">Admin Dashboard</Button>
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

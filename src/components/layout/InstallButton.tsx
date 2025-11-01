'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';

// This interface is a subset of the BeforeInstallPromptEvent interface
// It's defined here to avoid TypeScript errors since the type is not standard
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export function InstallButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isAppInstalled, setIsAppInstalled] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setDeferredPrompt(e as BeforeInstall_promptEvent);
    };

    const handleAppInstalled = () => {
      // Hide the app-provided install promotion
      setDeferredPrompt(null);
      setIsAppInstalled(true);
    };
    
    // Check if the app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
        setIsAppInstalled(true);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Show the install prompt
    deferredPrompt.prompt();
    // Wait for the user to respond to the prompt
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    // We can only use the prompt once, so clear it.
    setDeferredPrompt(null);
  };

  if (!deferredPrompt || isAppInstalled) {
    return null;
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleInstallClick}
      title="Install App"
    >
      <Download className="h-5 w-5" />
      <span className="sr-only">Install App</span>
    </Button>
  );
}

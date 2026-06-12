'use client';

import { useState } from 'react';
import { Check, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';

interface ReplayShareDownloadProps {
  title: string;
  urlHorizontal: string;
  urlReelsVertical?: string | null;
}

export function ReplayShareDownload({
  title,
  urlHorizontal,
  urlReelsVertical,
}: ReplayShareDownloadProps) {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState<'horizontal' | 'vertical' | null>(null);
  const [copied, setCopied] = useState(false);

  const handleDownload = async (url: string, kind: 'horizontal' | 'vertical') => {
    setDownloading(kind);
    try {
      const link = document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^\w\sÀ-ú-]/g, '').trim()}_${kind}.mp4`;
      link.target = '_blank';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast('Download iniciado');
    } finally {
      setDownloading(null);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
        return;
      } catch {
        // cancelado
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast('Link copiado para a área de transferência');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <Button
        variant="secondary"
        size="sm"
        loading={downloading === 'horizontal'}
        onClick={() => handleDownload(urlHorizontal, 'horizontal')}
      >
        <Download className="h-4 w-4" /> Replay 16:9
      </Button>
      {urlReelsVertical && (
        <Button
          variant="secondary"
          size="sm"
          loading={downloading === 'vertical'}
          onClick={() => handleDownload(urlReelsVertical, 'vertical')}
        >
          <Download className="h-4 w-4" /> Reels 9:16
        </Button>
      )}
      <Button variant="outline" size="sm" onClick={handleShare}>
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {copied ? 'Copiado!' : 'Compartilhar'}
      </Button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Check, Download, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import type { Video } from '@/types';

export function ShareDownload({ video }: { video: Video }) {
  const { toast } = useToast();
  const [downloading, setDownloading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const link = document.createElement('a');
      link.href = video.videoUrl;
      link.download = `${video.title.replace(/[^\w\sÀ-ú-]/g, '').trim()}.mp4`;
      link.target = '_blank';
      link.rel = 'noopener';
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast('Download iniciado');
    } finally {
      setDownloading(false);
    }
  };

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title: video.title, text: video.description, url });
        return;
      } catch {
        // usuário cancelou — cai no copy
      }
    }
    await navigator.clipboard.writeText(url);
    setCopied(true);
    toast('Link copiado para a área de transferência');
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="secondary" size="sm" loading={downloading} onClick={handleDownload}>
        <Download className="h-4 w-4" /> Download
      </Button>
      <Button variant="outline" size="sm" onClick={handleShare}>
        {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
        {copied ? 'Copiado!' : 'Compartilhar'}
      </Button>
    </div>
  );
}

'use client';

import { useCallback, useRef, useState, type DragEvent } from 'react';
import { ImagePlus, User } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { compressImageToDataUrl } from '@/lib/utils/compress-image';

interface AvatarUploadProps {
  value: string | null;
  onChange: (dataUrl: string | null) => void;
  required?: boolean;
}

export function AvatarUpload({ value, onChange, required = false }: AvatarUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const readFile = useCallback(
    async (file: File) => {
      if (!file.type.startsWith('image/')) return;
      try {
        const dataUrl = await compressImageToDataUrl(file);
        onChange(dataUrl);
      } catch {
        onChange(null);
      }
    },
    [onChange]
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) readFile(file);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={cn(
          'group relative flex h-36 w-36 items-center justify-center overflow-hidden rounded-full border-2 border-dashed transition-all duration-300',
          dragging
            ? 'border-neon bg-neon/10 shadow-glow-strong'
            : value
              ? 'border-neon/50 shadow-glow'
              : 'border-zinc-700 bg-surface-raised hover:border-neon/50 hover:shadow-glow'
        )}
      >
        {value ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={value} alt="Avatar" className="h-full w-full object-cover" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-zinc-500 transition-colors group-hover:text-neon">
            <User className="h-10 w-10" />
            <span className="text-[10px] font-medium uppercase tracking-wide">Sua foto</span>
          </div>
        )}
        <span className="absolute inset-0 flex items-center justify-center bg-black/60 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <ImagePlus className="h-6 w-6 text-neon" />
        </span>
      </button>

      <p className="text-xs text-zinc-500">
        {required ? (
          <>
            <span className="font-medium text-neon">Obrigatório</span> — arraste ou{' '}
          </>
        ) : (
          <>Arraste uma imagem ou </>
        )}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="font-medium text-neon hover:opacity-80"
        >
          clique para escolher
        </button>
      </p>

      {value && (
        <button
          type="button"
          onClick={() => onChange(null)}
          className="text-xs text-zinc-600 transition-colors hover:text-red-400"
        >
          Remover foto
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) readFile(file);
        }}
      />
    </div>
  );
}

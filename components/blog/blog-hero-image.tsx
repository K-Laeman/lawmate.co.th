'use client';

import Image from 'next/image';

interface BlogHeroImageProps {
  src: string;
  alt: string;
}

export function BlogHeroImage({ src, alt }: BlogHeroImageProps) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes="100vw"
      className="object-cover"
      priority
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = '/images/placeholder-blog.jpg';
      }}
    />
  );
}

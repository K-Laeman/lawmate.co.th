import Image from 'next/image';
import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
  size?: number;
  variant?: 'dark' | 'light';
}

export function Logo({ className, size = 60, variant = 'dark' }: LogoProps) {
  return (
    <Image
      src="/logo.svg"
      alt="เพื่อนทนาย Logo"
      width={size}
      height={size}
      className={cn(
        className,
        variant === 'light' && 'invert'
      )}
    />
  );
}

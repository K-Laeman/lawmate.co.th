'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Phone, MessageCircle, HelpCircle, Headset, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FloatingHotlineProps {
  phoneNumber?: string;
  lineId?: string;
  className?: string;
  enabled?: boolean;
}

export function FloatingHotline({
  phoneNumber = '02-123-4567',
  lineId = '@lawmate',
  className,
  enabled = true,
}: FloatingHotlineProps) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const dashboardPaths = ['/dashboard', '/lawyer', '/admin', '/consultation', '/cases'];
  if (dashboardPaths.some((p) => pathname.startsWith(p))) return null;
  if (!enabled) return null;

  const actionButtons = [
    {
      icon: HelpCircle,
      label: 'คำถามที่พบบ่อย',
      href: '/faq',
      bgColor: 'bg-orange-500 hover:bg-orange-600',
    },
    {
      icon: MessageCircle,
      label: 'LINE',
      href: `https://line.me/R/ti/p/${lineId}`,
      bgColor: 'bg-green-500 hover:bg-green-600',
    },
    {
      icon: Phone,
      label: 'โทรศัพท์',
      href: `tel:${phoneNumber.replace(/-/g, '')}`,
      bgColor: 'bg-blue-500 hover:bg-blue-600',
    },
  ];

  return (
    <TooltipProvider delayDuration={100}>
      <div className={cn('fixed bottom-6 right-6 z-50 flex flex-col items-center gap-3', className)}>
        {/* Action Buttons */}
        <div
          className={cn(
            'flex flex-col items-center gap-3 transition-all duration-300',
            isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
          )}
        >
          {actionButtons.map((button, index) => (
            <Tooltip key={index}>
              <TooltipTrigger asChild>
                <a
                  href={button.href}
                  className={cn(
                    'w-12 h-12 rounded-full',
                    button.bgColor,
                    'text-white',
                    'flex items-center justify-center',
                    'shadow-lg hover:shadow-xl',
                    'transition-all duration-300 hover:scale-110',
                  )}
                  style={{
                    transitionDelay: isOpen ? `${index * 50}ms` : '0ms',
                  }}
                  aria-label={button.label}
                >
                  <button.icon className="w-5 h-5" />
                </a>
              </TooltipTrigger>
              <TooltipContent side="left" sideOffset={8}>
                <p>{button.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {/* Main Toggle Button */}
        <div className="flex flex-col items-center gap-1">
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                  'w-14 h-14 rounded-2xl',
                  'bg-primary hover:bg-primary/90 text-white',
                  'flex items-center justify-center',
                  'shadow-lg hover:shadow-xl',
                  'transition-all duration-300 hover:scale-105',
                  !isOpen && 'animate-bounce',
                )}
                aria-label={isOpen ? 'ปิดเมนูติดต่อ' : 'เปิดเมนูติดต่อ'}
              >
                {isOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Headset className="w-6 h-6" />
                )}
              </button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={8}>
              <p>{isOpen ? 'ปิดเมนู' : 'ติดต่อเรา'}</p>
            </TooltipContent>
          </Tooltip>
          {!isOpen && (
            <span className="text-[10px] font-medium text-gray-600">
              ช่วยเหลือ
            </span>
          )}
        </div>
      </div>
    </TooltipProvider>
  );
}

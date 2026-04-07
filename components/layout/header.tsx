'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, ChevronDown, User } from 'lucide-react';
import { Logo } from '@/components/ui/logo';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const DASHBOARD_URL = process.env.NEXT_PUBLIC_DASHBOARD_URL || 'http://localhost:3000';

interface NavItem {
  label: string;
  href: string;
  isActive?: boolean;
}

const DEFAULT_NAV_ITEMS: NavItem[] = [
  { label: 'หน้าแรก', href: '/' },
  { label: 'ค้นหาทนาย', href: '/lawyers' },
  { label: 'บริการองค์กร', href: '/corporate' },
  { label: 'บทความ', href: '/blogs' },
  { label: 'เกี่ยวกับเรา', href: '/about' },
  { label: 'คำถามที่พบบ่อย', href: '/faq' },
  { label: 'นโยบาย', href: '/policies' },
  { label: 'ติดต่อเรา', href: '/contact' },
];

interface HeaderCta {
  clientButtonText?: string;
  lawyerButtonText?: string;
  lawyerLoginText?: string;
  lawyerRegisterText?: string;
}

interface CurrentUser {
  id: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface HeaderProps {
  variant?: 'dark' | 'light';
  navItems?: NavItem[] | null;
  headerCta?: HeaderCta | null;
  forceScrolled?: boolean;
  currentUser?: CurrentUser | null;
}

export function Header({ variant = 'dark', navItems: cmsNavItems, headerCta, forceScrolled = false, currentUser }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(forceScrolled);
  const [user, setUser] = useState<CurrentUser | null>(currentUser ?? null);
  const pathname = usePathname();
  const useDarkText = isScrolled || variant === 'light';

  // Use CMS nav items if available (filtering inactive), otherwise fall back to defaults
  const navItems = cmsNavItems?.length
    ? cmsNavItems.filter((item) => item.isActive !== false)
    : DEFAULT_NAV_ITEMS;

  const clientButtonText = headerCta?.clientButtonText || 'สำหรับลูกความ';
  const lawyerButtonText = headerCta?.lawyerButtonText || 'สำหรับเพื่อนทนาย';
  const lawyerLoginText = headerCta?.lawyerLoginText || 'เข้าสู่ระบบ';
  const lawyerRegisterText = headerCta?.lawyerRegisterText || 'สมัครสมาชิก';

  // Re-check session on client-side navigation and when window regains focus (e.g. after login in new tab)
  const checkSession = () => {
    fetch('/api/v1/auth/session')
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => setUser(data?.user ?? null))
      .catch(() => {});
  };

  useEffect(() => {
    checkSession();
  }, [pathname]);

  useEffect(() => {
    window.addEventListener('focus', checkSession);
    return () => window.removeEventListener('focus', checkSession);
  }, []);

  // Handle scroll effect
  useEffect(() => {
    if (forceScrolled) {
      return;
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    // Initial check
    handleScroll();
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [forceScrolled]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        useDarkText
          ? "bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm"
          : "bg-transparent border-transparent"
      )}
    >
      <nav className="container-wide mx-auto px-4 sm:px-6 lg:px-8">
        <div className={cn(
          "flex items-center justify-between transition-all duration-300",
          isScrolled ? "h-16 md:h-20" : "h-16 md:h-28"
        )}>
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Logo
              size={104}
              variant={useDarkText ? 'dark' : 'light'}
              className={cn(
                "transition-all duration-300",
                isScrolled ? "w-16 h-16" : "w-[104px] h-[104px]"
              )}
            />
            <div className="flex flex-col">
              <span className={cn(
                "text-lg font-bold leading-tight transition-colors duration-300",
                useDarkText ? "text-navy-dark" : "text-white"
              )}>
                เพื่อนทนาย
              </span>
              <span className={cn(
                "text-xs leading-tight transition-colors duration-300",
                useDarkText ? "text-gray-500" : "text-white/80"
              )}>
                by LawMate
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  useDarkText
                    ? "text-gray-600 hover:text-primary"
                    : "text-white/90 hover:text-white"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>

          {/* Desktop CTA Buttons — static links to dashboard app */}
          <div className="hidden lg:flex items-center gap-3">
            {user ? (
              <>
                <span className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  useDarkText ? "text-gray-600" : "text-white/90"
                )}>
                  สวัสดี, {user.firstName}
                </span>
                <Button
                  asChild
                  className={cn(
                    "transition-all duration-300 shadow-md hover:shadow-lg",
                    !useDarkText && "bg-white text-primary hover:bg-white/90 border-transparent"
                  )}
                >
                  <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer">
                    <User className="w-4 h-4 mr-1" />
                    แดชบอร์ด
                  </a>
                </Button>
              </>
            ) : (
              <>
                <Button
                  asChild
                  className={cn(
                    "transition-all duration-300 shadow-md hover:shadow-lg",
                    !useDarkText && "bg-white text-primary hover:bg-white/90 border-transparent"
                  )}
                >
                  <a href={`${DASHBOARD_URL}/login`} target="_blank" rel="noopener noreferrer">{clientButtonText}</a>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button className={cn(
                      "transition-all duration-300 shadow-md hover:shadow-lg",
                      !useDarkText && "bg-white text-primary hover:bg-white/90 border-transparent"
                    )}>
                      {lawyerButtonText}
                      <ChevronDown className="w-4 h-4 ml-1" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="min-w-[var(--radix-dropdown-menu-trigger-width)]">
                    <DropdownMenuItem asChild>
                      <a href={`${DASHBOARD_URL}/login?role=lawyer`} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                        {lawyerLoginText}
                      </a>
                    </DropdownMenuItem>
                    <DropdownMenuItem disabled>
                      {lawyerRegisterText}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "transition-colors duration-300",
                  useDarkText
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-white hover:bg-white/10"
                )}
              >
                <Menu className="h-6 w-6" />
                <span className="sr-only">เปิดเมนู</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:w-80 p-6">
              <SheetHeader>
                <SheetTitle className="flex items-center gap-2">
                  <Logo size={32} variant="dark" />
                  <span>เพื่อนทนาย</span>
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="text-base font-medium text-gray-600 hover:text-primary transition-colors py-2"
                  >
                    {item.label}
                  </Link>
                ))}
                <div className="border-t border-gray-200 pt-4 mt-4 flex flex-col gap-3">
                  {user ? (
                    <>
                      <p className="text-sm text-gray-600 font-medium">สวัสดี, {user.firstName} {user.lastName}</p>
                      <Button asChild className="w-full">
                        <a href={DASHBOARD_URL} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                          <User className="w-4 h-4 mr-1" />
                          แดชบอร์ด
                        </a>
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button asChild className="w-full">
                        <a href={`${DASHBOARD_URL}/login`} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                          {clientButtonText}
                        </a>
                      </Button>
                      <p className="text-xs text-gray-500 mt-2">{lawyerButtonText}</p>
                      <Button variant="outline" asChild className="w-full">
                        <a href={`${DASHBOARD_URL}/login?role=lawyer`} target="_blank" rel="noopener noreferrer" onClick={() => setIsOpen(false)}>
                          {lawyerLoginText}
                        </a>
                      </Button>
                      <Button className="w-full" disabled>
                        {lawyerRegisterText}
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </nav>
    </header>
  );
}

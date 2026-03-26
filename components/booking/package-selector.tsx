'use client';

import { Check, Clock, Star, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useBookingStore } from '@/lib/stores/booking-store';
import { mockPackages, formatPrice, formatDuration } from '@/data/packages';
import { cn } from '@/lib/utils';

interface PackageSelectorProps {
  onNext: () => void;
  onBack: () => void;
}

export function PackageSelector({ onNext, onBack }: PackageSelectorProps) {
  const { selectedPackage, setPackage } = useBookingStore();

  const handleNext = () => {
    if (!selectedPackage) {
      toast.error('กรุณาเลือกแพ็คเกจ');
      return;
    }
    toast.success(`เลือกแพ็คเกจ ${selectedPackage.nameTh} แล้ว`);
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Package Cards */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {mockPackages.map((pkg) => (
          <Card
            key={pkg.id}
            className={cn(
              'relative cursor-pointer transition-all hover:shadow-lg',
              selectedPackage?.id === pkg.id && 'ring-2 ring-primary/20',
              pkg.isPopular
                ? 'bg-primary border-primary text-white'
                : 'bg-white',
              selectedPackage?.id === pkg.id && !pkg.isPopular && 'border-primary'
            )}
            onClick={() => setPackage(pkg)}
          >
            {/* Popular Badge */}
            {pkg.isPopular && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-white text-primary px-3 shadow-md">
                  <Star className="w-3 h-3 mr-1 fill-current" />
                  แนะนำ
                </Badge>
              </div>
            )}

            {/* Selected Check */}
            {selectedPackage?.id === pkg.id && (
              <div className="absolute top-3 right-3">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center',
                  pkg.isPopular ? 'bg-white' : 'bg-primary'
                )}>
                  <Check className={cn(
                    'w-4 h-4',
                    pkg.isPopular ? 'text-primary' : 'text-white'
                  )} />
                </div>
              </div>
            )}

            <CardHeader className="text-center pt-6 pb-2">
              <CardDescription className={cn(
                'font-medium',
                pkg.isPopular ? 'text-white/80' : 'text-primary'
              )}>
                {pkg.name}
              </CardDescription>
              <CardTitle className={cn(
                'text-xl',
                pkg.isPopular && 'text-white'
              )}>{pkg.nameTh}</CardTitle>
              <div className={cn(
                'flex items-center justify-center gap-1 mt-1',
                pkg.isPopular ? 'text-white/70' : 'text-gray-500'
              )}>
                <Clock className="w-4 h-4" />
                <span className="text-sm">{formatDuration(pkg.durationMinutes)}</span>
              </div>
            </CardHeader>

            <CardContent className="pt-2">
              {/* Price */}
              <div className="text-center mb-4">
                <span className={cn(
                  'text-3xl font-bold',
                  pkg.isPopular ? 'text-white' : 'text-navy-dark'
                )}>
                  {formatPrice(pkg.price)}
                </span>
                <span className={cn(
                  'ml-1',
                  pkg.isPopular ? 'text-white/80' : 'text-gray-500'
                )}>บาท</span>
              </div>

              {/* Features */}
              <ul className="space-y-2">
                {pkg.features.slice(0, 4).map((feature, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <Check className={cn(
                      'w-4 h-4 flex-shrink-0 mt-0.5',
                      pkg.isPopular ? 'text-white' : 'text-green-500'
                    )} />
                    <span className={pkg.isPopular ? 'text-white/90' : 'text-gray-600'}>
                      {feature}
                    </span>
                  </li>
                ))}
                {pkg.features.length > 4 && (
                  <li className={cn(
                    'text-sm pl-6',
                    pkg.isPopular ? 'text-white/60' : 'text-gray-400'
                  )}>
                    +{pkg.features.length - 4} อื่นๆ
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button variant="outline" size="lg" onClick={onBack} className="w-full sm:w-auto min-h-[48px] order-2 sm:order-1">
          <ArrowLeft className="mr-2 w-5 h-5" />
          ย้อนกลับ
        </Button>
        <Button size="lg" onClick={handleNext} disabled={!selectedPackage} className="w-full sm:w-auto min-h-[48px] order-1 sm:order-2">
          ถัดไป
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

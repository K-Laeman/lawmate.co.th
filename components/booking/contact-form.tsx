'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Phone, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useBookingStore } from '@/lib/stores/booking-store';

const contactSchema = z.object({
  phone: z
    .string()
    .min(1, 'กรุณากรอกเบอร์โทรศัพท์')
    .regex(/^0[0-9]{9}$/, 'เบอร์โทรศัพท์ไม่ถูกต้อง'),
  email: z
    .string()
    .email('อีเมลไม่ถูกต้อง')
    .optional()
    .or(z.literal('')),
});

type ContactFormData = z.infer<typeof contactSchema>;

interface ContactFormProps {
  onNext: () => void;
  onBack: () => void;
}

export function ContactForm({ onNext, onBack }: ContactFormProps) {
  const { contactPhone, contactEmail, setContact } = useBookingStore();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      phone: contactPhone || '',
      email: contactEmail || '',
    },
    mode: 'onChange',
  });

  const onSubmit = (data: ContactFormData) => {
    setContact(data.phone, data.email || '');
    toast.success('บันทึกข้อมูลติดต่อเรียบร้อย');
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      <div className="max-w-md mx-auto space-y-6">
        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">เบอร์โทรศัพท์ติดต่อ *</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="phone"
              type="tel"
              placeholder="0812345678"
              className="pl-10"
              {...register('phone')}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-red-500">{errors.phone.message}</p>
          )}
          <p className="text-sm text-gray-500">
            ทนายจะติดต่อกลับผ่านเบอร์นี้
          </p>
        </div>

        {/* Email */}
        <div className="space-y-2">
          <Label htmlFor="email">อีเมล (ไม่บังคับ)</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="email@example.com"
              className="pl-10"
              {...register('email')}
            />
          </div>
          {errors.email && (
            <p className="text-sm text-red-500">{errors.email.message}</p>
          )}
          <p className="text-sm text-gray-500">
            สำหรับส่งใบเสร็จและรายละเอียดการนัดหมาย
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button type="button" variant="outline" size="lg" onClick={onBack} className="w-full sm:w-auto min-h-[48px] order-2 sm:order-1">
          <ArrowLeft className="mr-2 w-5 h-5" />
          ย้อนกลับ
        </Button>
        <Button type="submit" size="lg" disabled={!isValid} className="w-full sm:w-auto min-h-[48px] order-1 sm:order-2">
          ถัดไป
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </form>
  );
}

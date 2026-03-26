'use client';

import { useState, useMemo } from 'react';
import { format, addDays, isSameDay, isAfter, startOfDay } from 'date-fns';
import { th } from 'date-fns/locale';
import { ChevronLeft, ChevronRight, Clock, ArrowRight, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useBookingStore } from '@/lib/stores/booking-store';
import { cn } from '@/lib/utils';

// Available time slots
const timeSlots = [
  '09:00', '09:30', '10:00', '10:30', '11:00', '11:30',
  '13:00', '13:30', '14:00', '14:30', '15:00', '15:30',
  '16:00', '16:30', '17:00', '17:30', '18:00', '18:30',
];

// Mock unavailable slots (in real app, fetch from API)
const unavailableSlots: Record<string, string[]> = {
  // date string -> array of unavailable times
};

// Calculate end time based on start time and duration
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60);
  const endMins = totalMinutes % 60;
  return `${endHours.toString().padStart(2, '0')}:${endMins.toString().padStart(2, '0')}`;
}

interface TimeSlotPickerProps {
  onNext: () => void;
  onBack: () => void;
}

export function TimeSlotPicker({ onNext, onBack }: TimeSlotPickerProps) {
  const { selectedDate, selectedTime, setSchedule, selectedLawyer, selectedPackage } = useBookingStore();
  const [weekOffset, setWeekOffset] = useState(0);

  const today = startOfDay(new Date());

  // Generate 7 days starting from today + weekOffset
  const days = useMemo(() => {
    return Array.from({ length: 7 }).map((_, i) => addDays(today, i + weekOffset * 7));
  }, [today, weekOffset]);

  const handleDateSelect = (date: Date) => {
    setSchedule(date, null);
  };

  const handleTimeSelect = (time: string) => {
    setSchedule(selectedDate, time);
  };

  const getAvailableSlots = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    const unavailable = unavailableSlots[dateStr] || [];

    // If it's today, filter out past times
    const now = new Date();
    return timeSlots.filter((time) => {
      if (unavailable.includes(time)) return false;

      if (isSameDay(date, now)) {
        const [hours, minutes] = time.split(':').map(Number);
        const slotTime = new Date(date);
        slotTime.setHours(hours, minutes, 0, 0);
        return isAfter(slotTime, now);
      }

      return true;
    });
  };

  const availableSlots = selectedDate ? getAvailableSlots(selectedDate) : [];
  const packageDuration = selectedPackage?.durationMinutes || 60;

  const isComplete = selectedDate && selectedTime;

  const handleNext = () => {
    if (!isComplete) {
      toast.error('กรุณาเลือกวันและเวลา');
      return;
    }
    toast.success('เลือกวันเวลาเรียบร้อย');
    onNext();
  };

  return (
    <div className="space-y-8">
      {/* Date Selection */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-navy-dark">เลือกวันที่</h3>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset(weekOffset - 1)}
              disabled={weekOffset === 0}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setWeekOffset(weekOffset + 1)}
              disabled={weekOffset >= 3}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-2">
          {days.map((date) => {
            const isSelected = selectedDate && isSameDay(date, selectedDate);
            const isToday = isSameDay(date, today);
            const slotsAvailable = getAvailableSlots(date).length;

            return (
              <Card
                key={date.toISOString()}
                className={cn(
                  'cursor-pointer transition-all text-center',
                  isSelected && 'border-primary bg-primary/5',
                  slotsAvailable === 0 && 'opacity-50 cursor-not-allowed'
                )}
                onClick={() => slotsAvailable > 0 && handleDateSelect(date)}
              >
                <CardContent className="p-3">
                  <p className="text-xs text-gray-500 uppercase">
                    {format(date, 'EEE', { locale: th })}
                  </p>
                  <p
                    className={cn(
                      'text-xl font-bold',
                      isSelected ? 'text-primary' : 'text-navy-dark'
                    )}
                  >
                    {format(date, 'd')}
                  </p>
                  <p className="text-xs text-gray-500">
                    {format(date, 'MMM', { locale: th })}
                  </p>
                  {isToday && (
                    <p className="text-xs text-primary font-medium mt-1">วันนี้</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Time Selection */}
      {selectedDate && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-gray-500" />
            <h3 className="font-semibold text-navy-dark">
              เลือกเวลา - {format(selectedDate, 'd MMMM yyyy', { locale: th })}
            </h3>
          </div>

          {availableSlots.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-3">
              {availableSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTime === time ? 'default' : 'outline'}
                  className="h-12 text-sm"
                  onClick={() => handleTimeSelect(time)}
                >
                  {time} - {calculateEndTime(time, packageDuration)}
                </Button>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              ไม่มีช่วงเวลาว่างในวันนี้ กรุณาเลือกวันอื่น
            </div>
          )}
        </div>
      )}

      {/* Selected Summary */}
      {isComplete && (
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4">
            <p className="text-sm text-gray-600">คุณเลือก:</p>
            <p className="font-semibold text-navy-dark text-lg">
              {format(selectedDate, 'วันEEEE ที่ d MMMM yyyy', { locale: th })} เวลา {selectedTime} - {calculateEndTime(selectedTime, packageDuration)} น.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row gap-3 sm:justify-between">
        <Button variant="outline" size="lg" onClick={onBack} className="w-full sm:w-auto min-h-[48px] order-2 sm:order-1">
          <ArrowLeft className="mr-2 w-5 h-5" />
          ย้อนกลับ
        </Button>
        <Button size="lg" onClick={handleNext} disabled={!isComplete} className="w-full sm:w-auto min-h-[48px] order-1 sm:order-2">
          ถัดไป
          <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </div>
    </div>
  );
}

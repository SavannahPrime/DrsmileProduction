
import { useState } from 'react';
import { format } from 'date-fns';
import { CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const timeSlots = [
  "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM",
  "4:00 PM", "4:30 PM", "5:00 PM"
];

interface AppointmentDateSelectionProps {
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  timeSlot: string | undefined;
  setTimeSlot: (timeSlot: string | undefined) => void;
}

const AppointmentDateSelection = ({ 
  date, 
  setDate, 
  timeSlot, 
  setTimeSlot 
}: AppointmentDateSelectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      {/* Date Picker */}
      <div>
        <Label className="mb-2 block">Preferred Date</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left",
                !date && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "PPP") : <span>Select a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              onSelect={setDate}
              disabled={(date) => 
                date < new Date() || 
                date.getDay() === 0 || // Sunday
                date > new Date(new Date().setMonth(new Date().getMonth() + 2))
              }
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>
      </div>
      
      {/* Time Slots */}
      <div>
        <Label className="mb-2 block">Preferred Time</Label>
        <div className="grid grid-cols-3 gap-2 max-h-[150px] overflow-y-auto p-1">
          {timeSlots.map((time) => (
            <div 
              key={time}
              className={cn(
                "rounded-md px-3 py-2 text-sm cursor-pointer border text-center transition-colors",
                timeSlot === time 
                  ? "bg-dental-blue text-white border-dental-blue" 
                  : "bg-white hover:bg-dental-light-blue/50 border-gray-200"
              )}
              onClick={() => setTimeSlot(time)}
            >
              {time}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AppointmentDateSelection;

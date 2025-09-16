"use client"

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
}

export function DatePicker({ value, onChange }: DatePickerProps) {
  const [date, setDate] = useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  // Add useEffect to update date when value changes
  useEffect(() => {
    setDate(value ? new Date(value) : undefined);
  }, [value]);

  const handleSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      const formattedDate = selectedDate.toISOString();
      setDate(selectedDate);
      onChange(formattedDate);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
      <Calendar
  mode="single"
  selected={date}
  onSelect={handleSelect}
  initialFocus
  captionLayout="dropdown"
  fromYear={1950}
  toYear={new Date().getFullYear()}
  classNames={{
    caption_label: "hidden", // Hide default caption label
    dropdown: "bg-white mt-2 text-black border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary", // Custom dropdown style
  }}
/>



      </PopoverContent>
    </Popover>
  );
}
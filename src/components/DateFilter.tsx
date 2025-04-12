import React, { useState } from "react";
import { format } from "date-fns";
import { CalendarIcon, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DateFilterProps {
  selectedDate: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const [month, setMonth] = useState<number>(
    selectedDate ? selectedDate.getMonth() : new Date().getMonth()
  );
  const [year, setYear] = useState<number>(
    selectedDate ? selectedDate.getFullYear() : new Date().getFullYear()
  );
  const years = Array.from(
    { length: 10 },
    (_, i) => new Date().getFullYear() - 5 + i
  );
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const handleMonthChange = (value: string) => {
    const newMonth = months.indexOf(value);
    setMonth(newMonth);
    updateSelectedDate(newMonth, year);
  };

  const handleYearChange = (value: string) => {
    const newYear = parseInt(value);
    setYear(newYear);
    updateSelectedDate(month, newYear);
  };

  const updateSelectedDate = (monthValue: number, yearValue: number) => {
    // Create a date object for the first day of the selected month/year
    const newDate = new Date(yearValue, monthValue, 1);
    onDateChange(newDate);
  };

  const clearFilter = () => {
    onDateChange(undefined);
  };

  return (
    <div className="flex items-center space-x-2">
      <div
        className="flex items-center gap-2 bg-white dark:bg-retro-navy border border-gray-200 dark:border-gray-700 rounded-md p-1.5
       font-mono retro-input"
      >
        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
        {/* Increased icon size */}
        <div className="flex items-center">
          <Select value={months[month]} onValueChange={handleMonthChange}>
            <SelectTrigger className="h-7 min-w-[110px] border-0 bg-transparent py-0 px-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm focus:ring-0">
              <SelectValue
                placeholder={months[new Date().getMonth()]}
                className="text-sm"
              />
            </SelectTrigger>
            <SelectContent>
              {months.map((monthName) => (
                <SelectItem
                  key={monthName}
                  value={monthName}
                  className="text-sm"
                >
                  {monthName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={year.toString()} onValueChange={handleYearChange}>
            <SelectTrigger className="h-7 min-w-[70px] border-0 bg-transparent py-0 px-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-sm focus:ring-0">
              <SelectValue
                placeholder={new Date().getFullYear().toString()}
                className="text-sm"
              />
            </SelectTrigger>
            <SelectContent>
              {years.map((yearValue) => (
                <SelectItem
                  key={yearValue}
                  value={yearValue.toString()}
                  className="text-sm"
                >
                  {yearValue}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {selectedDate && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearFilter}
          className="h-8 px-2 text-muted-foreground"
        >
          Clear
        </Button>
      )}
    </div>
  );
};

export default DateFilter;

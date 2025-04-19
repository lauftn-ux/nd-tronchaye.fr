import { useState } from "react";
import { useTranslation } from "react-i18next";
import PageSection from "../ui/PageSection";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock, Calendar as CalendarIcon, Plus } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, isSameDay } from "date-fns";
import { fr, enUS, de } from "date-fns/locale";
import { useLanguage } from "@/context/LanguageContext";
import { cn } from "@/lib/utils";

export default function CalendarSection() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [currentMonth, setCurrentMonth] = useState(new Date());
  
  const locales = {
    fr: fr,
    en: enUS,
    de: de
  };

  const { data: upcomingEvents, isLoading } = useQuery({
    queryKey: ['/api/events/upcoming'],
  });

  const days = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth)
  });

  // Get day names for the calendar based on the current language
  const getDayNames = () => {
    const locale = locales[language as keyof typeof locales] || fr;
    const days = [];
    for (let i = 0; i < 7; i++) {
      days.push(t(`calendar.days.${['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'][i]}`));
    }
    return days;
  };

  // Calculate calendar grid with previous and next month days
  const getCalendarGrid = () => {
    const firstDayOfMonth = startOfMonth(currentMonth);
    const lastDayOfMonth = endOfMonth(currentMonth);
    const startDate = firstDayOfMonth;
    const endDate = lastDayOfMonth;
    
    const daysInMonth = eachDayOfInterval({ start: startDate, end: endDate });
    
    // Create weeks array
    const weeks = [];
    let currentWeek = [];
    
    // Add empty cells for days before the first day of the month
    const firstDay = firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1;
    for (let i = 0; i < firstDay; i++) {
      currentWeek.push(null);
    }
    
    // Add days of the month
    for (const day of daysInMonth) {
      currentWeek.push(day);
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }
    
    // Add empty cells for days after the last day of the month
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }
    
    return weeks;
  };

  const prevMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  // Check if a date has an event
  const hasEvent = (date: Date) => {
    if (!upcomingEvents) return false;
    return upcomingEvents.some((event: any) => {
      const eventDate = new Date(event.date);
      return isSameDay(eventDate, date);
    });
  };

  // Check if a date is a Sunday (for styling purposes)
  const isSunday = (date: Date) => date.getDay() === 0;

  // Check if a date is a religious feast (for example purposes)
  const isReligiousFeast = (date: Date) => {
    // Example: August 15 is Assumption of Mary
    return date.getMonth() === 7 && date.getDate() === 15;
  };

  // Check if a date is night adoration (1st and 3rd Friday)
  const isNightAdoration = (date: Date) => {
    const day = date.getDay();
    const dayOfMonth = date.getDate();
    
    // Friday is day 5 (0-indexed, Sunday is 0)
    return day === 5 && (dayOfMonth <= 7 || (dayOfMonth > 14 && dayOfMonth <= 21));
  };

  return (
    <PageSection
      id="calendar"
      title={t('calendar.title')}
      subtitle={t('calendar.subtitle')}
      bgColor="bg-stone"
    >
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 mb-6">
          <div className="md:w-1/3 mb-6 md:mb-0">
            <div className="bg-primary text-white p-4 rounded-t-lg">
              <div className="flex justify-between items-center">
                <button onClick={prevMonth} className="text-white hover:text-accent transition-colors">
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <h3 className="font-cormorant text-xl">
                  {format(currentMonth, 'MMMM yyyy', { locale: locales[language as keyof typeof locales] || fr })}
                </h3>
                <button onClick={nextMonth} className="text-white hover:text-accent transition-colors">
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="bg-stone bg-opacity-30 p-4 rounded-b-lg">
              <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
                {getDayNames().map((day, index) => (
                  <span key={index}>{day}</span>
                ))}
              </div>
              
              <div className="grid grid-cols-7 gap-1 text-center">
                {getCalendarGrid().map((week, weekIndex) => (
                  week.map((day, dayIndex) => (
                    <div
                      key={`${weekIndex}-${dayIndex}`}
                      className={cn(
                        "h-8 w-8 flex items-center justify-center rounded-full mx-auto",
                        day ? (
                          cn(
                            !isSameMonth(day, currentMonth) && "text-gray-400",
                            isToday(day) && "bg-primary text-white",
                            isSunday(day) && !isToday(day) && "bg-primary text-white",
                            isReligiousFeast(day) && !isToday(day) && "bg-secondary text-white",
                            isNightAdoration(day) && !isToday(day) && !isReligiousFeast(day) && "bg-accent bg-opacity-30",
                            hasEvent(day) && !isToday(day) && !isSunday(day) && !isReligiousFeast(day) && !isNightAdoration(day) && "bg-secondary bg-opacity-30"
                          )
                        ) : "text-gray-400"
                      )}
                    >
                      {day ? format(day, 'd') : ''}
                    </div>
                  ))
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center mb-2">
                  <span className="w-3 h-3 bg-primary rounded-full mr-2"></span>
                  <span className="text-sm">{t('calendar.legend.sundayMass')}</span>
                </div>
                <div className="flex items-center mb-2">
                  <span className="w-3 h-3 bg-secondary rounded-full mr-2"></span>
                  <span className="text-sm">{t('calendar.legend.religiousFeast')}</span>
                </div>
                <div className="flex items-center">
                  <span className="w-3 h-3 bg-accent bg-opacity-70 rounded-full mr-2"></span>
                  <span className="text-sm">{t('calendar.legend.nightAdoration')}</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:w-2/3">
            <h3 className="font-cormorant text-2xl text-primary font-semibold mb-4">
              {t('calendar.upcomingEvents')}
            </h3>
            
            <div className="space-y-4">
              {isLoading ? (
                // Skeleton loading state
                Array(3).fill(0).map((_, index) => (
                  <div key={index} className="border-l-4 border-gray-300 pl-4 py-2">
                    <div className="flex items-center mb-1">
                      <Skeleton className="h-4 w-4 mr-2 rounded-full" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                ))
              ) : upcomingEvents?.length > 0 ? (
                upcomingEvents.map((event: any) => (
                  <div key={event.id} className={`border-l-4 border-${getBorderColorForEvent(event)} pl-4 py-2`}>
                    <div className="flex items-center mb-1">
                      <CalendarIcon className="text-secondary mr-2 h-4 w-4" />
                      <span className="text-sm font-semibold">{event.date}</span>
                    </div>
                    <h4 className="font-cormorant text-lg text-primary font-semibold">{event.title}</h4>
                    <p className="text-sm mb-2">{event.description}</p>
                    <div className="flex items-center text-xs text-gray-600">
                      <Clock className="mr-1 h-3 w-3" /> {event.time}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center py-8 text-gray-500">No upcoming events</p>
              )}
            </div>
            
            {/* Admin section for event management */}
            <div className="mt-8 pt-6 border-t border-gray-300">
              <h3 className="font-cormorant text-xl text-primary font-semibold mb-4">
                {t('calendar.eventManagement.title')}
              </h3>
              <p className="text-sm mb-4">{t('calendar.eventManagement.subtitle')}</p>
              
              <Button className="px-4 py-2 bg-primary text-white rounded hover:bg-opacity-90 transition-all text-sm">
                <Plus className="mr-2 h-4 w-4" />
                {t('calendar.eventManagement.addEvent')}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </PageSection>
  );
}

// Helper function to determine the border color for an event
function getBorderColorForEvent(event: any) {
  if (event.type === 'religious-feast') return 'secondary';
  if (event.type === 'adoration') return 'accent';
  if (event.type === 'pilgrimage') return 'primary';
  return 'primary';
}

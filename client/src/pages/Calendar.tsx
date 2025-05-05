import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";

export default function Calendar() {
  const { t } = useTranslation();
  const { language } = useLanguage();
  const [date, setDate] = useState<Date | undefined>(new Date());
  
  const { data: events, isLoading } = useQuery({
    queryKey: ['/api/events'],
  });
  
  const { data: specialEvents, isLoading: isLoadingSpecial } = useQuery({
    queryKey: ['/api/events/special/all'],
  });
  
  const handleBack = () => {
    window.location.href = "/#events";
  };
  
  // Function to determine if a date has an event
  const hasEvent = (date: Date) => {
    if (!events) return false;
    
    return events.some((event: any) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };
  
  // Function to find events for a specific date
  const getEventsForDate = (selectedDate: Date) => {
    if (!events) return [];
    
    return events.filter((event: any) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === selectedDate.getDate() &&
        eventDate.getMonth() === selectedDate.getMonth() &&
        eventDate.getFullYear() === selectedDate.getFullYear()
      );
    });
  };
  
  // Function to check if a date is Sunday
  const isSunday = (date: Date) => date.getDay() === 0;
  
  // Function to check if a date is a religious feast
  const isReligiousFeast = (date: Date) => {
    if (!specialEvents) return false;
    
    return specialEvents.some((event: any) => {
      if (event.type !== 'feast') return false;
      
      const eventDate = new Date(event.date);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() 
      );
    });
  };
  
  // Function to check if a date is a night adoration
  const isNightAdoration = (date: Date) => {
    // First and third Friday of the month
    return date.getDay() === 5 && (Math.ceil(date.getDate() / 7) === 1 || Math.ceil(date.getDate() / 7) === 3);
  };

  return (
    <div className="container mx-auto px-4 py-16 mt-20 mb-12">
      <Button 
        variant="ghost" 
        onClick={handleBack} 
        className="mb-6 flex items-center"
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        {t('common.back')}
      </Button>
      
      <h1 className="font-cormorant text-3xl md:text-4xl font-semibold text-primary mb-4">
        {t('calendar.title')}
      </h1>
      <p className="text-muted-foreground mb-8 max-w-3xl">
        {t('calendar.subtitle')}
      </p>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="font-cormorant text-xl font-semibold text-primary mb-4">
              {t('calendar.legend.title')}
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
                <span>{t('calendar.legend.sundayMass')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-purple-500 mr-2"></div>
                <span>{t('calendar.legend.religiousFeast')}</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-amber-500 mr-2"></div>
                <span>{t('calendar.legend.nightAdoration')}</span>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-cormorant text-xl font-semibold text-primary mb-4">
                {t('calendar.upcomingEvents')}
              </h3>
              
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              ) : (
                <div className="space-y-3">
                  {events?.slice(0, 5).map((event: any) => (
                    <div key={event.id} className="border-l-4 border-secondary pl-3 py-1">
                      <p className="font-medium">{event.title}</p>
                      <p className="text-sm text-gray-600">{formatDate(new Date(event.date), language)} - {event.time}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center mb-6">
              <CalendarIcon className="mr-2 h-5 w-5 text-secondary" />
              <h3 className="font-cormorant text-xl font-semibold text-primary">
                {t('calendar.title')}
              </h3>
            </div>
            
            <CalendarComponent
              mode="single"
              selected={date}
              onSelect={setDate}
              className="rounded-md border p-0"
              modifiers={{
                sunday: isSunday,
                feast: isReligiousFeast,
                adoration: isNightAdoration,
                event: hasEvent
              }}
              modifiersClassNames={{
                sunday: "bg-blue-100 text-blue-600 font-semibold",
                feast: "bg-purple-100 text-purple-600 font-semibold",
                adoration: "bg-amber-100 text-amber-600 font-semibold",
                event: "border-2 border-secondary"
              }}
            />
            
            {date && (
              <div className="mt-8">
                <h4 className="font-cormorant text-lg font-semibold text-primary mb-3">
                  {formatDate(date, language)}
                </h4>
                
                {getEventsForDate(date).length > 0 ? (
                  <div className="space-y-4">
                    {getEventsForDate(date).map((event: any) => (
                      <div key={event.id} className="border-l-4 border-secondary pl-3 py-2">
                        <p className="font-medium">{event.title}</p>
                        <p className="text-sm">{event.time}</p>
                        <p className="text-sm mt-2">{event.description.substring(0, 120)}...</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 italic">
                    {t('calendar.noEventsForDate')}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
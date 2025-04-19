import { useTranslation } from "react-i18next";
import PageSection from "../ui/PageSection";
import EventCard from "./EventCard";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from "wouter";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventsSection() {
  const { t } = useTranslation();
  
  const { data: events, isLoading } = useQuery({
    queryKey: ['/api/events'],
  });

  return (
    <PageSection
      id="events"
      title={t('events.title')}
      subtitle={t('events.subtitle')}
    >
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {isLoading ? (
          // Skeleton loading state
          Array(3).fill(0).map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
              <Skeleton className="w-full h-48" />
              <div className="p-6 space-y-4">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
              </div>
            </div>
          ))
        ) : (
          events?.slice(0, 3).map((event) => (
            <EventCard key={event.id} event={event} />
          ))
        )}
      </div>
      
      <div className="text-center mt-10">
        <div
          onClick={() => window.location.href = "/calendar"}
          className="inline-flex items-center px-6 py-3 bg-primary text-white font-semibold rounded hover:bg-opacity-90 transition-all cursor-pointer"
        >
          <Calendar className="mr-2 h-5 w-5" />
          {t('calendar.title')}
        </div>
      </div>
    </PageSection>
  );
}

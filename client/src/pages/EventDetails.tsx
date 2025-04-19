import { useParams, useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { formatDate } from "@/lib/utils";
import { 
  ChevronLeft,
  Calendar,
  Clock,
  Share2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function EventDetails() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { t } = useTranslation();
  const { language } = useLanguage();
  const eventId = parseInt(id);

  const { data: event, isLoading, error } = useQuery({
    queryKey: [`/api/events/${eventId}`],
    enabled: !isNaN(eventId),
  });

  if (isNaN(eventId)) {
    setLocation("/not-found");
    return null;
  }

  const handleBack = () => {
    setLocation("/#events");
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: event?.title,
        text: event?.description,
        url: window.location.href,
      }).catch((error) => console.log('Error sharing', error));
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href)
        .then(() => alert(t('common.linkCopied')))
        .catch((err) => console.error('Could not copy text: ', err));
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 mt-16">
        <div className="mb-6">
          <Button variant="ghost" onClick={handleBack} className="mb-6">
            <ChevronLeft className="mr-2 h-4 w-4" />
            {t('common.back')}
          </Button>
          <Skeleton className="h-12 w-2/3 mb-4" />
          <div className="flex space-x-4 mb-6">
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-6 w-32" />
          </div>
        </div>
        
        <Skeleton className="w-full h-[400px] rounded-lg mb-8" />
        
        <div className="space-y-4">
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-full" />
          <Skeleton className="h-6 w-3/4" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 mt-16">
        <div className="bg-red-50 border border-red-200 p-6 rounded-lg">
          <h2 className="text-xl text-red-700 mb-2">Error</h2>
          <p className="text-red-600">Failed to load event details. Please try again later.</p>
          <Button onClick={handleBack} className="mt-4">
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="container mx-auto max-w-4xl px-4 py-16 mt-16">
        <div className="bg-amber-50 border border-amber-200 p-6 rounded-lg">
          <h2 className="text-xl text-amber-700 mb-2">{t('common.notFound')}</h2>
          <p className="text-amber-600">{t('common.eventNotFound')}</p>
          <Button onClick={handleBack} className="mt-4">
            {t('common.back')}
          </Button>
        </div>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = formatDate(eventDate, language);

  return (
    <div className="container mx-auto max-w-4xl px-4 py-16 mt-16">
      <div className="mb-6">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ChevronLeft className="mr-2 h-4 w-4" />
          {t('common.back')}
        </Button>
        <h1 className="font-cormorant text-3xl md:text-4xl font-semibold text-primary mb-4">
          {event.title}
        </h1>
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="mr-2 h-4 w-4 text-secondary" />
            {formattedDate}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="mr-2 h-4 w-4 text-secondary" />
            {event.time}
          </div>
        </div>
      </div>
      
      <div className="relative mb-8">
        <img 
          src={event.imageUrl} 
          alt={event.title} 
          className="w-full h-auto object-cover rounded-lg" 
        />
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-4 right-4 bg-white bg-opacity-80 hover:bg-opacity-100 text-primary rounded-full"
          onClick={handleShare}
        >
          <Share2 className="h-5 w-5" />
        </Button>
      </div>
      
      <div className="prose max-w-none">
        <p className="whitespace-pre-line">{event.description}</p>
      </div>
      
      <div className="mt-12 border-t border-gray-200 pt-8">
        <h2 className="font-cormorant text-2xl text-primary font-semibold mb-4">
          {t('events.relatedEvents')}
        </h2>
        
        <div className="bg-stone p-6 rounded-lg">
          <p className="text-center">
            {t('events.interestedInEvent')}
          </p>
          <div className="flex justify-center mt-4">
            <Link href="/#contact">
              <Button className="bg-primary text-white">
                {t('common.contact')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "wouter";
import { formatDate } from "@/lib/utils";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslation } from "react-i18next";
import { Clock } from "lucide-react";

interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  imageUrl: string;
}

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const { language } = useLanguage();
  const { t } = useTranslation();
  const { id, title, description, date, time, imageUrl } = event;

  // Convert date string to Date object for formatting
  const eventDate = new Date(date);
  const formattedDate = formatDate(eventDate, language);

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="relative">
        <img 
          src={imageUrl} 
          alt={title} 
          className="w-full h-48 object-cover" 
        />
        <div className="absolute top-0 left-0 bg-secondary text-white px-3 py-1 m-3 rounded-md">
          <span className="text-sm font-semibold">{formattedDate}</span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-cormorant text-xl text-primary font-semibold mb-2">{title}</h3>
        <p className="text-sm mb-4">
          {description.length > 100 ? `${description.substring(0, 100)}...` : description}
        </p>
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-600">
            <Clock className="inline mr-1 h-3 w-3" /> {time}
          </span>
          <Link href={`/events/${id}`}>
            <a className="text-secondary hover:text-primary transition-colors text-sm font-semibold">
              {t('common.details')}
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}

import { useTranslation } from "react-i18next";
import PageSection from "../ui/PageSection";
import { useQuery } from "@tanstack/react-query";
import { Church, HandHelping, Calendar } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Skeleton } from "@/components/ui/skeleton";

export default function ScheduleSection() {
  const { t } = useTranslation();
  
  const { data: specialEvents, isLoading } = useQuery({
    queryKey: ['/api/events/special/all'],
  });

  return (
    <PageSection
      id="schedule"
      title={t('schedule.title')}
      subtitle={t('schedule.subtitle')}
    >
      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-primary text-white p-4">
            <h3 className="font-cormorant text-2xl flex items-center">
              <Church className="mr-3 h-6 w-6" />
              {t('schedule.regularMasses.title')}
            </h3>
          </div>
          <div className="p-6">
            <ul className="space-y-4">
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="font-semibold">{t('schedule.regularMasses.sunday')}</span>
                <span className="bg-stone px-3 py-1 rounded-full">11h00</span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="font-semibold">{t('schedule.regularMasses.tuesday')}</span>
                <span className="bg-stone px-3 py-1 rounded-full">9h00</span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="font-semibold">{t('schedule.regularMasses.wednesday')}</span>
                <span className="bg-stone px-3 py-1 rounded-full">9h00</span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="font-semibold">{t('schedule.regularMasses.thursday')}</span>
                <span className="bg-stone px-3 py-1 rounded-full">18h00</span>
              </li>
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="font-semibold">{t('schedule.regularMasses.friday')}</span>
                <span className="bg-stone px-3 py-1 rounded-full">9h00</span>
              </li>
              <li className="flex justify-between items-center">
                <span className="font-semibold">{t('schedule.regularMasses.saturday')}</span>
                <span className="bg-stone px-3 py-1 rounded-full">9h00</span>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-secondary text-white p-4">
            <h3 className="font-cormorant text-2xl flex items-center">
              <HandHelping className="mr-3 h-6 w-6" />
              {t('schedule.confessions.title')}
            </h3>
          </div>
          <div className="p-6">
            <h4 className="font-cormorant text-xl text-primary mb-3">{t('schedule.confessions.confessionsTitle')}</h4>
            <p className="mb-4 pb-3 border-b border-gray-200">
              {t('schedule.confessions.confessionsText')}
            </p>
            
            <h4 className="font-cormorant text-xl text-primary mb-3 mt-4">{t('schedule.confessions.adorationsTitle')}</h4>
            <ul className="space-y-4">
              <li className="flex justify-between items-center pb-3 border-b border-gray-200">
                <span className="font-semibold">{t('schedule.confessions.thursday')}</span>
                <span className="bg-stone px-3 py-1 rounded-full">{t('schedule.confessions.thursdayTime')}</span>
              </li>
              <li className="flex items-center justify-between pb-3 border-b border-gray-200">
                <span className="font-semibold">
                  {t('schedule.confessions.nightAdoration')}
                  <br />
                  <small>{t('schedule.confessions.nightAdorationDay')}</small>
                </span>
                <span className="bg-stone px-3 py-1 rounded-full">{t('schedule.confessions.nightAdorationTime')}</span>
              </li>
              <li className="flex items-center justify-between">
                <span className="font-semibold">{t('schedule.confessions.rosary')}</span>
                <span className="bg-stone px-3 py-1 rounded-full">{t('schedule.confessions.rosaryTime')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      <div className="mt-12 bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-accent text-primary p-4">
          <h3 className="font-cormorant text-2xl flex items-center">
            <Calendar className="mr-3 h-6 w-6" />
            {t('schedule.specialEvents.title')}
          </h3>
        </div>
        <div className="p-6">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('schedule.specialEvents.date')}</TableHead>
                  <TableHead>{t('schedule.specialEvents.event')}</TableHead>
                  <TableHead>{t('schedule.specialEvents.time')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  Array(3).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-6 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-40" /></TableCell>
                      <TableCell><Skeleton className="h-6 w-32" /></TableCell>
                    </TableRow>
                  ))
                ) : specialEvents?.length > 0 ? (
                  specialEvents.map((event) => (
                    <TableRow key={event.id}>
                      <TableCell>{event.date}</TableCell>
                      <TableCell>{event.title}</TableCell>
                      <TableCell>{event.time}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={3} className="text-center py-4">
                      {t('schedule.specialEvents.noEvents', 'No special events scheduled')}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </PageSection>
  );
}

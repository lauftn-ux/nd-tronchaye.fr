import { useTranslation } from "react-i18next";
import PageSection from "../ui/PageSection";
import { Wrench } from "lucide-react";

export default function HistorySection() {
  const { t } = useTranslation();

  return (
    <PageSection
      id="history"
      title={t('history.title')}
      bgColor="bg-stone"
    >
      <div className="flex flex-col md:flex-row gap-10">
        <div className="md:w-1/2">
          <h3 className="font-cormorant text-2xl text-secondary mb-4">
            {t('history.origins.title')}
          </h3>
          <p className="mb-4">
            {t('history.origins.paragraph1')}
          </p>
          <p className="mb-4">
            {t('history.origins.paragraph2')}
          </p>
          <p>
            {t('history.origins.paragraph3')}
          </p>
          
          <div className="mt-6">
            <button 
              onClick={() => window.open('/histoire', '_blank')} 
              className="bg-secondary hover:bg-secondary/90 text-white px-6 py-2 rounded-md transition-colors"
            >
              {t('common.learnMore')}
            </button>
          </div>
          
          <div className="mt-10" id="architecture">
            <h3 className="font-cormorant text-2xl text-secondary mb-4">
              {t('history.architecture.title')}
            </h3>
            <p className="mb-4">
              {t('history.architecture.paragraph1')}
            </p>
            <ul className="list-disc ml-5 mb-4">
              <li>{t('history.architecture.choirAndApse')}</li>
              <li>{t('history.architecture.nave')}</li>
              <li>{t('history.architecture.southPorch')}</li>
              <li>{t('history.architecture.statue')}</li>
            </ul>
          </div>
        </div>
        
        <div className="md:w-1/2 space-y-6">
          <img 
            src="https://images.unsplash.com/photo-1548743934-f91a7cfce122?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500&q=80" 
            alt="Vue extérieure du sanctuaire" 
            className="w-full h-auto rounded-lg shadow-md" 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <img 
              src="https://images.unsplash.com/photo-1601085134995-344fe3fa29bf?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" 
              alt="Détails architecturaux" 
              className="w-full h-auto rounded-lg shadow-md" 
            />
            <img 
              src="https://images.unsplash.com/photo-1508098682722-e99c643e7485?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300&q=80" 
              alt="Vitraux du sanctuaire" 
              className="w-full h-auto rounded-lg shadow-md" 
            />
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h4 className="font-cormorant text-xl text-primary mb-2">
              {t('history.architecture.restorations')}
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="text-accent mr-2"><Wrench size={16} /></span>
                <span><strong>1860-1865</strong> : {t('history.architecture.restoration1')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2"><Wrench size={16} /></span>
                <span><strong>1950-1952</strong> : {t('history.architecture.restoration2')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2"><Wrench size={16} /></span>
                <span><strong>2005-2008</strong> : {t('history.architecture.restoration3')}</span>
              </li>
              <li className="flex items-start">
                <span className="text-accent mr-2"><Wrench size={16} /></span>
                <span><strong>2019-2021</strong> : {t('history.architecture.restoration4')}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </PageSection>
  );
}

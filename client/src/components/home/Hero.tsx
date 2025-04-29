import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import { Clock, Landmark } from "lucide-react";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section 
      id="home" 
      className="pt-24 bg-cover bg-center bg-no-repeat" 
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1500021804447-2ca2eaaaabeb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080&q=80')", 
        height: "85vh" 
      }}
    >
      <div className="h-full flex items-center justify-center bg-black bg-opacity-50">
        <div className="text-center px-4">
          <h1 className="font-cormorant text-4xl md:text-6xl font-bold text-white leading-tight mb-2">
            {t('home.title')}
          </h1>
          <p className="text-xl md:text-2xl text-white font-light max-w-2xl mx-auto mb-8">
            {t('home.subtitle')}
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <div
              className="px-6 py-3 bg-primary text-white font-semibold rounded hover:bg-opacity-90 transition-all flex items-center cursor-pointer"
              onClick={() => window.location.hash = "schedule"}
            >
              <Clock className="mr-2 h-5 w-5" />
              {t('home.viewMassTimes')}
            </div>
            <div
              className="px-6 py-3 bg-accent text-primary font-semibold rounded hover:bg-opacity-90 transition-all flex items-center cursor-pointer"
              onClick={() => window.location.hash = "history"}
            >
              <Landmark className="mr-2 h-5 w-5" />
              {t('home.discoverHistory')}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

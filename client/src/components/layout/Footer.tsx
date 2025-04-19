import { Link } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../LanguageSwitcher";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Facebook, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";

export default function Footer() {
  const { t } = useTranslation();

  const navigationItems = [
    { href: "/", label: t("navigation.home") },
    { href: "/#history", label: t("navigation.history") },
    { href: "/#schedule", label: t("navigation.schedule") },
    { href: "/#sacraments", label: t("navigation.sacraments") },
    { href: "/#events", label: t("navigation.events") },
    { href: "/#gallery", label: t("navigation.gallery") },
    { href: "/#contact", label: t("navigation.contact") }
  ];

  return (
    <footer className="bg-primary text-white py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-1/4">
            <img 
              src="https://images.unsplash.com/photo-1605256585681-455837661b76?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80" 
              alt="Logo Notre Dame de la Tronchaye" 
              className="h-16 w-auto mb-4" 
            />
            <h3 className="font-cormorant text-xl font-semibold mb-2">Notre Dame de la Tronchaye</h3>
            <p className="text-sm text-gray-300 mb-4">Sanctuaire marial au cœur de la Bretagne historique.</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="text-white hover:text-accent transition-colors">
                <Youtube size={18} />
              </a>
            </div>
          </div>
          
          <div className="lg:w-1/4">
            <h4 className="text-accent font-semibold mb-4">{t('footer.quickLinks')}</h4>
            <ul className="space-y-2">
              {navigationItems.map((item) => (
                <li key={item.href}>
                  <Link href={item.href}>
                    <a className="text-gray-300 hover:text-white transition-colors">
                      {item.label}
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="lg:w-1/4">
            <h4 className="text-accent font-semibold mb-4">{t('footer.information')}</h4>
            <ul className="space-y-2">
              <li className="flex items-start">
                <MapPin className="mt-1 mr-2 h-4 w-4" />
                <span className="text-sm">
                  Sanctuaire Notre Dame de la Tronchaye<br />
                  Place Notre Dame<br />
                  56220 Rochefort-en-Terre<br />
                  France
                </span>
              </li>
              <li className="flex items-start">
                <Phone className="mt-1 mr-2 h-4 w-4" />
                <span className="text-sm">+33 (0)2 97 43 33 37</span>
              </li>
              <li className="flex items-start">
                <Mail className="mt-1 mr-2 h-4 w-4" />
                <span className="text-sm">contact@notredamedetronchaye.fr</span>
              </li>
            </ul>
          </div>
          
          <div className="lg:w-1/4">
            <h4 className="text-accent font-semibold mb-4">{t('footer.newsletter.title')}</h4>
            <p className="text-sm text-gray-300 mb-4">{t('footer.newsletter.subtitle')}</p>
            <form className="space-y-2">
              <Input 
                type="email" 
                placeholder={t('footer.newsletter.placeholder')} 
                className="w-full px-3 py-2 bg-opacity-10 bg-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-accent text-white text-sm" 
              />
              <Button type="submit" className="w-full px-3 py-2 bg-accent text-primary font-semibold rounded-md hover:bg-opacity-90 transition-all text-sm">
                {t('footer.newsletter.subscribe')}
              </Button>
            </form>
          </div>
        </div>
        
        <div className="mt-8 pt-8 border-t border-gray-700 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm text-gray-400">
            {t('footer.rights')}
          </div>
          
          <div className="flex space-x-4 text-sm text-gray-400">
            <a href="#" className="hover:text-white transition-colors">{t('footer.termsAndPolicy.legalNotice')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.termsAndPolicy.privacyPolicy')}</a>
            <a href="#" className="hover:text-white transition-colors">{t('footer.termsAndPolicy.siteMap')}</a>
          </div>
          
          <LanguageSwitcher variant="footer" />
        </div>
      </div>
    </footer>
  );
}

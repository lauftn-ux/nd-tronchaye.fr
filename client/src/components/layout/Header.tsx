import { useState } from "react";
import { Link, useLocation } from "wouter";
import { useTranslation } from "react-i18next";
import LanguageSwitcher, { MobileLanguageSwitcher } from "../LanguageSwitcher";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Header() {
  const [location] = useLocation();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

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
    <header className="fixed top-0 w-full bg-white bg-opacity-95 shadow-md z-50">
      <div className="container mx-auto px-4 py-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <div className="mr-4">
              <img 
                src="https://images.unsplash.com/photo-1605256585681-455837661b76?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100&q=80" 
                alt="Logo Notre Dame de la Tronchaye" 
                className="h-12 w-auto" 
              />
            </div>
            <div>
              <h1 className="font-cormorant text-xl font-semibold text-primary">Notre Dame de la Tronchaye</h1>
              <p className="text-xs text-secondary">Rochefort en Terre</p>
            </div>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <MobileLanguageSwitcher />
            
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="text-primary">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-3 py-3 mt-10">
                  {navigationItems.map((item) => (
                    <div key={item.href}>
                      <div
                        className="text-primary hover:text-secondary transition-colors block py-2 cursor-pointer"
                        onClick={() => {
                          setIsOpen(false);
                          window.location.href = item.href;
                        }}
                      >
                        {item.label}
                      </div>

                    </div>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <div key={item.href} className="relative group">
                <div 
                  className="text-primary hover:text-secondary transition-colors cursor-pointer"
                  onClick={() => window.location.href = item.href}
                >
                  {item.label}
                </div>
              </div>
            ))}
          </nav>
          
          {/* Language Selector */}
          <LanguageSwitcher />
        </div>
      </div>
    </header>
  );
}

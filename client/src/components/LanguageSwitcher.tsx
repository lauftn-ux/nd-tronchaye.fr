import { useLanguage } from "@/context/LanguageContext";
import { LANGUAGES } from "@/lib/utils";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

interface LanguageSwitcherProps {
  variant?: "header" | "footer";
  className?: string;
}

export default function LanguageSwitcher({ 
  variant = "header", 
  className 
}: LanguageSwitcherProps) {
  const { language, setLanguage } = useLanguage();

  const handleLanguageChange = (code: string) => {
    setLanguage(code);
  };

  // For mobile view or footer
  if (variant === "footer") {
    return (
      <div className={cn("flex space-x-4", className)}>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={cn(
              "text-sm text-gray-300 hover:text-white transition-colors",
              language === lang.code && "font-semibold text-white"
            )}
          >
            {lang.label}
          </button>
        ))}
      </div>
    );
  }

  // For desktop header - buttons
  return (
    <div className="hidden md:flex items-center ml-6">
      {LANGUAGES.map((lang) => (
        <Button
          key={lang.code}
          variant="ghost"
          size="sm"
          onClick={() => handleLanguageChange(lang.code)}
          className={cn(
            "px-2 py-1 font-medium text-sm rounded",
            language === lang.code ? "bg-stone hover:bg-gray-200" : "hover:bg-gray-200"
          )}
        >
          {lang.code.toUpperCase()}
        </Button>
      ))}
    </div>
  );
}

export function MobileLanguageSwitcher() {
  const { language, setLanguage } = useLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Globe className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem 
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={cn(
              language === lang.code && "font-medium bg-accent/10"
            )}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

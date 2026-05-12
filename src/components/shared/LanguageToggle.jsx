import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import {
  Button,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui";
import { Globe } from "lucide-react";
import { getLanguage, saveLanguage } from "@/lib/storage";

// Langues disponibles dans le menu de selection
const LANGUAGES = [
  { code: "fr", label: "Français" },
  { code: "en", label: "English" },
];

/**
 * Composant pour basculer la langue de l'application
 */
export function LanguageToggle() {
  // Hooks pour la traduction et le state de montage
  const { i18n } = useTranslation();
  const [mounted, setMounted] = useState(false);
  // Eviter l'hydration mismatch avant le rendu cote client
  useEffect(() => {
    setMounted(true);
  }, []);
  // Ne rien rendre tant que le composant n'est pas monte
  if (!mounted) return null;
  // Changer la langue et la sauvegarder dans localStorage
  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode);
    saveLanguage(langCode);
  };
  // Langue actuellement active
  const currentLanguage = i18n.language || getLanguage();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button className="text-foreground/80" variant="ghost" size="icon">
          <Globe className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="space-y-1" align="end">
        {LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            // Mettre en evidence la langue active
            className={currentLanguage === lang.code ? "bg-accent" : ""}
          >
            {lang.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

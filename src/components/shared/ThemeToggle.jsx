import { useTheme } from "next-themes";
import { Button } from "@/components/ui";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Composant pour basculer entre mode clair et mode sombre
 */
export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Eviter l'hydration mismatch avant le rendu cote client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Basculer le theme (next-themes le persiste automatiquement dans localStorage)
  const handleThemeChange = () => {
    const isDark = theme === "dark";
    setTheme(isDark ? "light" : "dark");
  };

  // Icone et titre selon le theme actif
  const isDark = theme === "dark";

  return (
    <Button variant="ghost" size="icon" onClick={handleThemeChange}>
      {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </Button>
  );
}

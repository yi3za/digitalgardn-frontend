import { useTheme } from "next-themes";
import { Button } from "@/components/ui";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Composant pour basculer entre mode clair et mode sombre
 */
export function ThemeToggle() {
  // Hooks pour le theme et le state de montage
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  // Eviter l'hydration mismatch avant le rendu cote client
  useEffect(() => {
    setMounted(true);
  }, []);
  // Ne rien rendre tant que le composant n'est pas monte
  if (!mounted) return null;
  // Basculer le theme (next-themes le persiste automatiquement dans localStorage)
  const handleThemeChange = () => {
    const isDark = theme === "dark";
    setTheme(isDark ? "light" : "dark");
  };
  // Icone et titre selon le theme actif
  const isDark = theme === "dark";

  return (
    <Button
      className="text-foreground/80"
      variant="ghost"
      size="icon"
      onClick={handleThemeChange}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
    </Button>
  );
}

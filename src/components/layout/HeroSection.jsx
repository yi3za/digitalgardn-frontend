import { Link } from "react-router-dom";
import { SearchBar } from "../shared/SearchBar";
import {
  Button,
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui";
import { Logo } from "./Logo";

/**
 * Composant HeroSection pour la page d'accueil
 */
export function HeroSection({ t }) {
  return (
    <Card className="shadow-none border-none text-center gap-10 justify-center bg-background">
      <Logo className="mx-auto" />
      <CardHeader className="gap-3">
        <CardTitle className="text-5xl font-bold">
          {t("catalog:home.hero.title")}
        </CardTitle>
        <CardTitle className="text-6xl font-serif italic text-primary">
          {t("catalog:home.hero.titleAccent")}
        </CardTitle>
        <CardDescription className="text-lg">
          {t("catalog:home.hero.description")}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <SearchBar />
      </CardContent>
      <CardFooter className="justify-center">
        <Button asChild>
          <Link to="/services">{t("catalog:home.hero.actions.services")}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}

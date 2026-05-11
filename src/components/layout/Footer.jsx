import { APP_NAME } from "@/lib/config";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Button,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui";
import { Logo } from "./Logo";
import { SearchBar } from "../shared/SearchBar";
import { publicLinks } from "./Navbar";

/**
 * Composant Footer
 */
export function Footer() {
  // Hook pour la traduction
  const { t } = useTranslation("layout");

  return (
    <Card className="shadow-none border-y-0 rounded-none border-t border-primary/20 bg-background">
      <CardHeader>
        <CardTitle>
          <Logo />
        </CardTitle>
        <CardDescription>{t("footer.description")}</CardDescription>
        <CardAction>
          {publicLinks.map((link) => (
            <Button key={link.key} variant="link" asChild>
              <Link to={link.to}>{t(`header.${link.key}`)}</Link>
            </Button>
          ))}
        </CardAction>
      </CardHeader>
      <CardContent>
        <SearchBar />
      </CardContent>
      <CardFooter className="justify-center">
        {t("footer.copyright")} {APP_NAME} — {t("footer.built_with")}
      </CardFooter>
    </Card>
  );
}

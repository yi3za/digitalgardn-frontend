import { Link } from "react-router-dom";
import {
  Button,
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui";

/**
 * Composant Header
 */
export function Header() {
  return (
    <header className="flex justify-between items-center py-4">
      {/* logo */}
      <Link to="/" className="text-xl font-medium text-black dark:text-white">
        Digital<span className="text-primary">Gardn</span>
      </Link>
      {/* navigation */}
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuLink
              asChild
              className={navigationMenuTriggerStyle()}
            >
              <Link to="/">Accueil</Link>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
      {/* user actions */}
      <div className="flex items-center gap-4">
        <Button asChild variant="link">
          <Link to="/login">Se connecter</Link>
        </Button>
        <Button asChild>
          <Link to="/register">S'inscrire</Link>
        </Button>
      </div>
    </header>
  );
}

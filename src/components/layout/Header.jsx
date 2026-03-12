import { Link } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "../ui";

export function Header() {
  return (
    <header className="px-10 py-5 flex justify-between items-center">
      {/* logo */}
      <Link to="/" className="text-3xl font-medium">
        Digital<span className="text-green-500">Gardn</span>
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
        <Link
          to="/login"
          className="px-4 py-2 border border-green-500 text-green-500 rounded hover:bg-green-50 transition duration-200"
        >
          Se connecter
        </Link>
        <Link
          to="/register"
          className="px-4 py-2 border border-green-500 bg-green-500 text-white rounded hover:bg-green-600 transition duration-200"
        >
          S'inscrire
        </Link>
      </div>
    </header>
  );
}

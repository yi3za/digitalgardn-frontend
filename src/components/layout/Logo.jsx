import { Link } from "react-router-dom";
import { APP_NAME } from "@/lib/config";
import { Avatar, AvatarFallback, AvatarImage } from "../ui";
import { getFallbackName } from "@/lib/utils";
import logo from "@/assets/logo.png";

/**
 * Composant de logo de site web
 */
export function Logo({ className }) {
  // Generation du nom fallback pour l'avatar de l'application
  const AppFallback = getFallbackName(APP_NAME);
  // Separation du nom de l'application en deux parties pour styliser la seconde partie
  const [prefix, suffix] = [APP_NAME.slice(0, 7), APP_NAME.slice(7)];

  return (
    <Link
      to="/"
      className={`text-xl font-medium w-fit flex items-center ${className}`}
    >
      <Avatar className="mr-2">
        <AvatarImage src={logo} alt={APP_NAME} title={APP_NAME} />
        <AvatarFallback className="rounded-lg">{AppFallback}</AvatarFallback>
      </Avatar>
      {prefix}
      <span className="text-primary">{suffix}</span>
    </Link>
  );
}

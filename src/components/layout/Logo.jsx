import { Link } from "react-router-dom";
import { APP_NAME } from "@/lib/config";

/**
 * Composant de logo de site web
 */
export function Logo() {
  const [prefix, suffix] = [APP_NAME.slice(0, 7), APP_NAME.slice(7)];
  return (
    <Link to="/" className="text-xl font-medium min-w-1/4">
      {prefix}
      <span className="text-primary">{suffix}</span>
    </Link>
  );
}

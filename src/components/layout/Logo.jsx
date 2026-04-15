import { Link } from "react-router-dom";

/**
 * Composant de logo de site web
 */
export function Logo() {
  return (
    <Link to="/" className="text-xl font-medium min-w-1/4">
      Digital<span className="text-primary">Gardn</span>
    </Link>
  );
}

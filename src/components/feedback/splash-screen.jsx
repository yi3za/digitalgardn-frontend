import logo from "@/assets/logo.png";
import { APP_NAME } from "@/lib/config";

/**
 * Component de splash screen pour indiquer le chargement de l'application
 */
export function SplashScreen() {
  return (
    <div className="fixed inset-0 flex items-center justify-center">
      <img
        src={logo}
        alt={APP_NAME}
        title={APP_NAME}
        className="w-15 h-15 animate-pulse"
      />
    </div>
  );
}

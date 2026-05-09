import { Spinner } from "../ui";

/**
 * Component de splash screen pour indiquer le chargement de l'application
 */
export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}

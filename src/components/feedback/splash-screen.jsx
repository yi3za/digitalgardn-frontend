import { Spinner } from "../ui";

export function SplashScreen() {
  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center">
      <Spinner className="size-8" />
    </div>
  );
}

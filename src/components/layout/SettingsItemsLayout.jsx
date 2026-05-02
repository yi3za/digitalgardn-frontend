import { Card } from "../ui";
import { Outlet, useOutletContext } from "react-router-dom";

// Layout des sous-pages de parametres
// Transmet le contexte fourni par SettingsLayout aux pages enfants via useOutletContext()
export function SettingsItemsLayout() {
  const context = useOutletContext();
  return (
    <Card className="shadow-none border-none">
      <Outlet context={context} />
    </Card>
  );
}

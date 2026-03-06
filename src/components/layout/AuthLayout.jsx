import { Outlet } from "react-router-dom";
import { Card } from "../ui";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex justify-center items-center">
      <Card className="min-w-lg">
        <Outlet />
      </Card>
    </div>
  );
}

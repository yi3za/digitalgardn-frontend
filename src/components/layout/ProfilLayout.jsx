import { Outlet } from "react-router-dom";

export function ProfilLayout() {
  return (
    <div className="grid grid-cols-4 gap-5">
      <Outlet />
    </div>
  );
}

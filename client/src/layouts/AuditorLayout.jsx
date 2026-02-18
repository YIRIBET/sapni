// layouts/AuditorLayout.jsx
import { Outlet } from "react-router-dom";

function AuditorLayout() {
  return (
    <div className="min-h-screen bg-[#E6EAF3] p-8">
      <Outlet />
    </div>
  );
}

export default AuditorLayout;
import { Routes, Route, Navigate } from "react-router-dom";
import React from "react";
import { AuthProvider } from "./context/AuthContext";

import Login from "./views/login";
import NotFound from "./components/NotFound";

import Dashboard from "./views/Admin/Dashboard";
import Users from "./views/Admin/Users";
import Audithome from "./views/Auditor/Home";
import Clients from "./views/Admin/Clients";
import Campaings from "./views/Admin/Campaigns";

import AdminLayout from "./layouts/AdminLayout";
import AuditorLayout from "./layouts/AuditorLayout";

function RequireRole({ allowedRoles, children }) {
  const role = localStorage.getItem("userRole");

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Público */}
        <Route path="/" element={<Login />} />
        <Route path="/404" element={<NotFound />} />

        {/* ADMIN */}
        <Route
          element={
            <RequireRole allowedRoles={["SUPER_ADMIN"]}>
              <AdminLayout />
            </RequireRole>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/usuarios" element={<Users />} />
          <Route path="/clientes" element={<Clients />} />
          <Route path="/campaings" element={<Campaings />} />
        </Route>

        {/* AUDITOR */}
        <Route
          element={
            <RequireRole allowedRoles={["AUDITOR"]}>
              <AuditorLayout />
            </RequireRole>
          }
        >
          <Route path="/auditor/home" element={<Audithome />} />
        </Route>

        {/* Catch all */}
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
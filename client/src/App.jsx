import React from "react";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext.jsx";
//import Navbar from "./components/Navbar";
import Login from "./views/login";
import NotFound from "./components/NotFound";
import Dashboard from "./views/Admin/Dashboard.jsx";
import Audithome from "./views/Auditor/Home.jsx";

function getRoleFromToken() {
  const token = localStorage.getItem("token");
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  try {
    const payload = JSON.parse(atob(parts[1]));
    // Cambia esto para buscar el campo correcto en tu JWT
    return (
      payload.role_name?.toUpperCase() || payload.role?.toUpperCase() || null
    );
  } catch {
    return null;
  }
}

function getRoleFromStorage() {
  return localStorage.getItem("userRole");
}

function PrivateRoute({ children }) {
  const role = getRoleFromStorage();
  return role === "SUPER_ADMIN" ? children : <Navigate to="/login" replace />;
}

function AuditorRoute({ children }) {
  const role = getRoleFromStorage();
  return role === "AUDITOR" ? children : <Navigate to="/login" replace />;
}

function App() {
  const location = useLocation();
  const hideNavbarRoutes = ["/login", "/404"];
  return (
    <AuthProvider>
      {/*!hideNavbarRoutes.includes(location.pathname) && <Navbar />*/}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/404" element={<NotFound />} />

        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        {/* Rutas privadas auditor */}
        <Route
          path="/auditor/home"
          element={
            <AuditorRoute>
              <Audithome />
            </AuditorRoute>
          }
        />

        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;

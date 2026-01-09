// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import PermissionRoute from "./guards/PermissionRoute";

// Pages
import LoginPage from "./pages/LoginPage";
import Unauthorized from "./pages/Unauthorized";
import NotFound from "./pages/NotFound";
import ExecutiveDashboard from "./pages/ExecutiveDashboard";
import HomePage from "./pages/HomePage";
import Dashboard from "./pages/Dashboard";
// ... import other pages

import TopHeader from "./components/TopHeader";
import SideNav from "./components/SideNav";

// Layout
function AppLayout({ children }) {
  const [sidebarCollapsed, setSidebarCollapsed] = React.useState(true);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);
  const closeSidebar = () => setSidebarCollapsed(true);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className={`${sidebarCollapsed ? "" : "opacity-70 bg-gray-800 bg-opacity-20"}`}>
        <TopHeader onToggleSidebar={toggleSidebar} />
      </div>
      <div className="p-4 flex">
        <SideNav collapsed={sidebarCollapsed} onClose={closeSidebar} />
        <main className="flex-1 overflow-auto">{children}</main>
      </div>
    </div>
  );
}

// Routes Component
function AppRoutes() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      {/* Protected Routes */}
      {/* <Route
        path="/"
        element={
          <PermissionRoute permission="HOME_VIEW">
            <AppLayout>
              <ExecutiveDashboard />
            </AppLayout>
          </PermissionRoute>
        }
      /> */}
      {/* Protected Routes */}
      <Route
        path="/boss/dashboard"
        element={
          <PermissionRoute permission="DASHBOARD_VIEW">
            <AppLayout>
              <ExecutiveDashboard />
            </AppLayout>
          </PermissionRoute>
        }
      />
      <Route
        path="/dashboard"
        element={
          <PermissionRoute permission="DASHBOARD_VIEW">
            <AppLayout>
              <Dashboard />
            </AppLayout>
          </PermissionRoute>
        }
      />

      {/* Catch-all */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

// Top-level App
export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}



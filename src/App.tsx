import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./routers/ProtectedRoute";
// public route
import Login from "./page/auth/Login";
import Register from "./page/auth/Register";
import Index from "./page/Index";
// protected route
import Dashboard from "./page/dashboard/Index";
import TopicSelected from "./page/TopicSelected/Index";
import GuestProtectedRoute from "./routers/Guest";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* public route */}
        <Route path="/" element={<Index />} />
        <Route element={<GuestProtectedRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        {/* protected route */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/topicSelect" element={<TopicSelected />} />
        </Route>
        {/* if link not found navigate to /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

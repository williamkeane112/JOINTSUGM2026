import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// public route
import Auth from "./page/auth/Auth";
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
          <Route path="/auth" element={<Auth />} />
          {/* Legacy routes redirect to /auth */}
          <Route path="/login" element={<Navigate to="/auth" replace />} />
          <Route path="/register" element={<Navigate to="/auth" replace />} />
        </Route>
        {/* protected route */}
        {/* <Route element={<ProtectedRoute />}> */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/topicSelect" element={<TopicSelected />} />
        {/* </Route> */}
        {/* if link not found navigate to /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

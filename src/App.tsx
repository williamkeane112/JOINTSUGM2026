import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
// public route
import Auth from "./page/auth/Auth";
import Index from "./page/Index";
// protected route
import Dashboard from "./page/dashboard/Index";
import TopicSelected from "./page/Topic/Index";
import GuestProtectedRoute from "./routers/Guest";
import ProtectedRoute from "./routers/ProtectedRoute";
import TopicRequestForm from "./page/Topic/TopicRequestForm";
import LearningGoalDetail from "./page/learning/LearningGoalDetail";
import DiagnosticQuiz from "./page/learning/diagnostic/DiagnosticQuiz";
import LearningPathPage from "./page/learning/LearningPathPage";
import LearningStepPage from "./page/learning/LearningStepPage";
import CheckpointQuizPage from "./page/learning/CheckpointQuizPage";


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
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/topic" element={<TopicSelected />} />
          <Route path="/topic/request"   element={<TopicRequestForm />} />
          <Route path="/learning-goals/:id" element={<LearningGoalDetail />} />
          <Route path="/learning-goals/:id/diagnostic" element={<DiagnosticQuiz />} />
          <Route path="/learning-path/:id" element={<LearningPathPage />} />
          <Route path="/learning-path/:id/steps/:stepId" element={<LearningStepPage />} />
          <Route path="/learning-path/:id/checkpoint/:checkpointNumber" element={<CheckpointQuizPage />} />
        </Route>
        {/* if link not found navigate to /dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

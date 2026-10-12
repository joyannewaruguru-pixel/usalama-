import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import DashboardLayout from './layouts/DashboardLayout.jsx';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Reports from './pages/Reports.jsx';
import ReportDetails from './pages/ReportDetails.jsx';
import UpdateStatus from './pages/UpdateStatus.jsx';
import Statistics from './pages/Statistics.jsx';
import NotFound from './pages/NotFound.jsx';

function RequireAuth({ children }) {
  const { signedIn } = useAuth();
  return signedIn ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <RequireAuth>
            <DashboardLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/reports/:id" element={<ReportDetails />} />
        <Route path="/reports/:id/update" element={<UpdateStatus />} />
        <Route path="/statistics" element={<Statistics />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
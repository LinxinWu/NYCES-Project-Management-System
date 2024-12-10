import { Routes, Route } from 'react-router-dom';
import ClientLayout from '../components/layout/ClientLayout';
import AdminLayout from '../components/layout/AdminLayout';
import EntryPage from '../pages/EntryPage';
import ProjectWizard from '../components/wizard/ProjectWizard';
import Editor from '../pages/Editor';
import LoginPage from '../pages/LoginPage';
import ProtectedRoute from '../components/auth/ProtectedRoute';

function AppRoutes() {
  return (
    <Routes>
      {/* Client Routes */}
      <Route element={<ClientLayout />}>
        <Route path="/" element={<EntryPage />} />
        <Route path="/wizard" element={<ProjectWizard />} />
        <Route path="/editor/:projectId" element={<Editor />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/*" element={
        <ProtectedRoute>
          <AdminLayout />
        </ProtectedRoute>
      } />
    </Routes>
  );
}

export default AppRoutes; 
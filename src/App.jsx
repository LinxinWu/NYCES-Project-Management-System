import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './routes';
import { Provider } from 'react-redux';
import { store } from './store';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setCurrentProject } from './store/slices/projectSlice';

function AppContent() {
  const dispatch = useDispatch();

  // Handle project loading from URL
  useEffect(() => {
    const loadProjectFromURL = async () => {
      const pathParts = window.location.pathname.split('/');
      const projectId = pathParts[pathParts.indexOf('editor') + 1];
      
      if (projectId) {
        try {
          const project = await projectService.getProject(projectId);
          if (project) {
            console.log('Loading project from URL:', project);
            dispatch(setCurrentProject(project));
          }
        } catch (error) {
          console.error('Error loading project:', error);
        }
      }
    };

    loadProjectFromURL();
  }, [dispatch]);

  return <AppRoutes />;
}

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <ThemeProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </ThemeProvider>
      </AuthProvider>
    </Provider>
  );
}

export default App; 
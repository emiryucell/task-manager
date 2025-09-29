import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Navbar from './components/navbar/Navbar';
import Login from './components/login/Login';
import TaskList from './components/task/TaskList';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ApiInterceptor from './components/common/ApiInterceptor';
import ErrorBoundary from './components/common/ErrorBoundary';

import 'primereact/resources/themes/lara-light-indigo/theme.css'; 
import 'primereact/resources/primereact.min.css'; 
import 'primeicons/primeicons.css'; 
import 'primeflex/primeflex.css'; 
import './App.css';

const AuthChecker: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  
  useEffect(() => {
    if (!isAuthenticated && window.location.pathname !== '/login') {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);
  
  return <>{children}</>;
};

const PrivateRoute: React.FC<{ element: React.ReactNode }> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{element}</> : <Navigate to="/login" />;
};

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <ApiInterceptor />
      <AuthChecker>
        <div className="app-container">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route 
                path="/tasks" 
                element={<PrivateRoute element={<TaskList />} />} 
              />
              <Route path="/" element={<Navigate to={isAuthenticated ? "/tasks" : "/login"} />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Routes>
          </div>
        </div>
      </AuthChecker>
    </Router>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;

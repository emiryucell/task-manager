import React from 'react';
import { Button } from 'primereact/button';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import 'primeflex/primeflex.css';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex align-items-center justify-content-between p-3 bg-primary shadow-2">
      <div className="text-2xl font-bold text-black">Task Manager</div>
      <div>
        {isAuthenticated && user ? (
          <div className="flex align-items-center gap-3">
            <span className="text-black mr-3">Welcome, {user.username}</span>
            <Button 
              label="Logout" 
              icon="pi pi-sign-out" 
              className="p-button-sm p-button-danger" 
              onClick={handleLogout} 
            />
          </div>
        ) : (
          <span className="flex text-black">Please login</span>
        )}
      </div>
    </div>
  );
};

export default Navbar; 
import React, { useState } from 'react';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Card } from 'primereact/card';
import { Password } from 'primereact/password';
import { authService } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Message } from 'primereact/message';
import { extractErrorMessages } from '../../utils/errorUtils';
import 'primeflex/primeflex.css';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setErrorMessages([]);
      
      const response = await authService.login({ username, password });
      login(response.token);
      navigate('/tasks');
    } catch (err: any) {
      const errorMessages = extractErrorMessages(err);
      setErrorMessages(errorMessages);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-content-center align-items-center" style={{ minHeight: 'calc(100vh - 70px)' }}>
      <Card title="Login" className="w-full md:w-6 lg:w-4 shadow-2">
        <div className="p-fluid">
          <div className="field">
            <label htmlFor="username" className="font-bold">Username</label>
            <InputText
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              className="p-inputtext-lg"
            />
          </div>
          <div className="field">
            <label htmlFor="password" className="font-bold">Password</label>
            <Password
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              toggleMask
              className="p-inputtext-lg"
              feedback={false}
            />
          </div>
          {errorMessages.length > 0 && (
            <div className="field">
              {errorMessages.map((err, index) => (
                <Message key={index} severity="error" text={err} className="w-full mb-2" />
              ))}
            </div>
          )}
          <div className="field">
            <Button
              label="Login"
              icon="pi pi-sign-in"
              loading={loading}
              onClick={handleLogin}
              className="p-button-primary p-button-lg"
            />
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Login; 
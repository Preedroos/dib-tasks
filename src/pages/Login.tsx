import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLogin } from '../hooks/useLogin';
import { LoginPresenter } from './LoginPresenter';

export function Login() {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        errorMessage,
        handleLogin
    } = useLogin();

    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/dashboard', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    return (
        <LoginPresenter
            email={email}
            setEmail={setEmail}
            password={password}
            setPassword={setPassword}
            isLoading={isLoading}
            errorMessage={errorMessage}
            handleLogin={handleLogin}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
        />
    );
}
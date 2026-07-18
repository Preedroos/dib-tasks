import { useState } from 'react';
import { authService } from '../services/authService';

export function useLogin() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setErrorMessage(null);

        if (!email.trim() || !password.trim()) {
            setErrorMessage('Por favor, preencha todos os campos.');
            return;
        }

        try {
            setIsLoading(true);
            await authService.signIn(email, password);
        } catch (error: any) {
            setErrorMessage(error.message || 'Erro ao realizar login. Tente novamente.');
        } finally {
            setIsLoading(false);
        }
    };

    return {
        email,
        setEmail,
        password,
        setPassword,
        isLoading,
        errorMessage,
        handleLogin
    };
}

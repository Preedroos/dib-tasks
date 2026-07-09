import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useLogin } from '../hooks/useLogin';

export function Login() {
    const { user } = useAuth();
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

    useEffect(() => {
        if (user) {
            navigate('/dashboard', { replace: true });
        }
    }, [user, navigate]);

    return (
        <div className="min-h-screen bg-surface-container-low flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-surface-container-lowest p-8 rounded-3xl border border-outline-variant/40 shadow-xs animate-[fadeIn_0.3s_ease-out]">

                {/* Identidade / Logo Muck */}
                <div className="text-center mb-8">
                    <img src="./logo.svg" alt="Logo da Dog in Box" className="inline-flex items-center justify-center w-20 h-20" />
                    <h1 className="text-headline-md font-bold text-on-surface">Dog in Box</h1>
                    <p className="text-body-md text-on-surface-variant mt-1">Painel de Gerenciamento de Demandas</p>
                </div>

                {/* Mensagem de Erro */}
                {errorMessage && (
                    <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-sm flex items-start gap-2 border border-error/20 animate-[fadeIn_0.2s_ease-out]">
                        <span className="material-symbols-rounded text-[18px] shrink-0 mt-0.5">error</span>
                        <span>{errorMessage}</span>
                    </div>
                )}

                {/* Formulário */}
                <form onSubmit={handleLogin} className="space-y-5">
                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="email" className="text-sm font-semibold text-on-surface-variant px-1">
                            E-mail
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="nome@email.com"
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline/30 focus:border-primary focus:outline-hidden text-on-surface placeholder:text-on-surface-variant/50 transition-colors disabled:opacity-60"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label htmlFor="password" className="text-sm font-semibold text-on-surface-variant px-1">
                            Senha de acesso
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            disabled={isLoading}
                            className="w-full px-4 py-3 rounded-xl bg-surface-container border border-outline/30 focus:border-primary focus:outline-hidden text-on-surface placeholder:text-on-surface-variant/50 transition-colors disabled:opacity-60"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full mt-2 py-3.5 px-4 rounded-xl bg-primary hover:bg-primary-hover text-on-primary font-semibold transition-all active:scale-[0.98] disabled:opacity-50 disabled:scale-100 flex items-center justify-center gap-2 cursor-pointer"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5 text-on-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Autenticando...</span>
                            </>
                        ) : (
                            <span>Entrar no Painel</span>
                        )}
                    </button>
                </form>

            </div>
        </div>
    );
}
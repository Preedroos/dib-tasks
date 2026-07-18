interface LoginPresenterProps {
  email: string;
  setEmail: (email: string) => void;
  password: string;
  setPassword: (password: string) => void;
  isLoading: boolean;
  errorMessage: string | null;
  handleLogin: (e: React.FormEvent<HTMLFormElement>) => void;
  showPassword: boolean;
  setShowPassword: (show: boolean) => void;
}

export function LoginPresenter({
  email,
  setEmail,
  password,
  setPassword,
  isLoading,
  errorMessage,
  handleLogin,
  showPassword,
  setShowPassword,
}: LoginPresenterProps) {
  return (
    <div className="min-h-screen flex flex-col font-body-lg text-on-background relative bg-transparent">
      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center items-center px-container-padding-mobile pb-12 w-full max-w-md mx-auto relative z-10">
        {/* Brand Header Section */}
        <div className="w-full flex flex-col items-center mb-10 text-center animate-fade-in-up">
          {/* Logo Container */}
          <div className="w-24 h-24 mb-6 rounded-3xl bg-surface shadow-[0_8px_24px_rgba(0,0,0,0.06)] flex items-center justify-center relative overflow-hidden border border-surface-variant/50">
            <img src="logo.svg" className="p-2" alt="Dog In Box Logo" />
            {/* Subtle gradient overlay for premium feel */}
            <div className="absolute inset-0 bg-gradient-to-tr from-primary-container/10 to-transparent pointer-events-none"></div>
          </div>
          <h1 className="font-headline-lg-mobile text-headline-lg-mobile text-on-background mb-2">Bem-vindo(a)</h1>
          <p className="font-body-md text-body-md text-on-surface-variant">Gerenciamento de demandas do Marketing</p>
        </div>

        {/* Login Form Card */}
        <div className="w-full bg-surface rounded-[24px] p-6 shadow-[0_12px_32px_rgba(0,0,0,0.05)] border border-white/50 backdrop-blur-sm animate-fade-in-up" style={{ animationDelay: '0.1s' }}>

          {/* Mensagem de Erro */}
          {errorMessage && (
            <div className="mb-6 p-4 rounded-xl bg-error-container text-on-error-container text-sm flex items-start gap-2 border border-error/20 animate-[fadeIn_0.2s_ease-out]">
              <span className="material-symbols-outlined text-[18px] shrink-0 mt-0.5" style={{ fontVariationSettings: "'FILL' 1" }}>error</span>
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-5 w-full">
            {/* Email Input Group */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="email">
                E-mail
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">mail</span>
                </div>
                <input
                  className="w-full h-12 pl-11 pr-4 bg-surface-container-lowest border border-surface-variant rounded-xl text-on-surface font-body-md placeholder-outline-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all ios-input-shadow disabled:opacity-60"
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="seu@email.com.br"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Input Group */}
            <div className="flex flex-col gap-1.5 w-full">
              <label className="font-label-md text-label-md text-on-surface-variant ml-1" htmlFor="password">
                Senha
              </label>
              <div className="relative w-full">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="material-symbols-outlined text-outline">lock</span>
                </div>
                <input
                  className="w-full h-12 pl-11 pr-11 bg-surface-container-lowest border border-surface-variant rounded-xl text-on-surface font-body-md placeholder-outline-variant focus:outline-none focus:border-primary-container focus:ring-1 focus:ring-primary-container transition-all ios-input-shadow disabled:opacity-60"
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                />
                {/* Password Visibility Toggle */}
                <button
                  aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-outline hover:text-on-surface transition-colors focus:outline-none min-h-[44px] min-w-[44px] justify-center cursor-pointer"
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <span className="material-symbols-outlined text-[20px]">
                    {showPassword ? "visibility" : "visibility_off"}
                  </span>
                </button>
              </div>
            </div>

            {/* Primary Action Button */}
            <button
              className="w-full h-[48px] bg-primary-container text-white rounded-xl font-label-md text-label-md tracking-wide shadow-[0_4px_12px_rgba(194,31,36,0.25)] hover:shadow-[0_6px_16px_rgba(194,31,36,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 mt-2 disabled:opacity-50 disabled:scale-100 disabled:translate-y-0 disabled:shadow-none cursor-pointer"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Autenticando...</span>
                </>
              ) : (
                <>
                  Acessar Dashboard
                  <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
                </>
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

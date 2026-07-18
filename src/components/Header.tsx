interface HeaderProps {
    actionIcon?: 'settings_account_box' | 'dashboard';
    showActionButton?: boolean;
    onActionClick?: () => void;
    onLogout?: () => void;
}

export function Header({ actionIcon = 'settings_account_box', showActionButton = false, onActionClick, onLogout }: HeaderProps) {
    return (
        <header className="bg-primary shadow-sm flex justify-between items-center px-6 h-[64px] w-full sticky top-0 z-50">
            <div className="flex items-center gap-2">
                <img src="/logo.svg" alt="Dog In Box" className="w-24 h-auto object-contain" />
                <span className="text-xs font-bold bg-white/20 px-2 py-0.5 rounded text-white tracking-widest">TASKS</span>
            </div>
            <div className="flex gap-4">
                {showActionButton && (
                    <button
                        onClick={onActionClick}
                        className="material-symbols-outlined cursor-pointer text-on-primary active:scale-90 transition-all"
                        aria-label="Ação principal"
                    >
                        {actionIcon}
                    </button>
                )}
                <button
                    onClick={onLogout}
                    className="material-symbols-outlined cursor-pointer text-on-primary active:scale-90 transition-all"
                    aria-label="Sair"
                >
                    logout
                </button>
            </div>
        </header>
    )
}
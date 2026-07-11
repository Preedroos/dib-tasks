interface FloatingActionButtonProps {
    icon: string;
    onClick: () => void;
}

export function FloatingActionButton({ icon, onClick }: FloatingActionButtonProps) {
    return (
        <button
            onClick={onClick}
            className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-on-primary rounded-2xl shadow-lg flex items-center justify-center active:scale-90 hover:opacity-90 transition-all z-40">
            <span className="material-symbols-outlined text-[32px]">{icon}</span>
        </button>
    )
}
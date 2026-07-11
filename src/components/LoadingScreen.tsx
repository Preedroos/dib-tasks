import { useState } from 'react';

const LOADING_PHRASES = [
    "Farejando novas demandas...",
    "Enterrando os bugs no quintal...",
    "Abanando o rabo para os novos prazos...",
    "Cavando as melhores soluções...",
    "Enchendo o pote de ração e organizando os cards...",
    "Correndo atrás da bolinha (e dos jobs)...",
    "Afiando as garras para produzir mais...",
    "Dando aquela espreguiçada antes do briefing..."
];

const PAW_ANIMATION_STEPS = [
    { delay: '0s', transform: '-rotate-[15deg] translate-y-2' },
    { delay: '0.3s', transform: 'rotate-[15deg] -translate-y-2' },
    { delay: '0.6s', transform: '-rotate-[15deg] translate-y-2' },
    { delay: '0.9s', transform: 'rotate-[15deg] -translate-y-2' }
];

export function LoadingScreen({ isFadingOut = false }: { isFadingOut?: boolean }) {
    const [loadingPhrase] = useState(() => {
        return LOADING_PHRASES[Math.floor(Math.random() * LOADING_PHRASES.length)]
    });

    return (
        <div
            className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gray-50 p-6 select-none transition-opacity duration-200 ease-out ${isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
                }`}
        >
            <div className="flex items-center justify-center gap-5 h-16 w-72 mx-auto mb-6 pointer-events-none">
                {PAW_ANIMATION_STEPS.map((step, index) => (
                    <div
                        key={index}
                        className={`material-symbols-outlined animate-[pulse_1.2s_infinite_ease-in-out] transform ${step.transform}`}
                        style={{ animationDelay: step.delay }}
                    >
                        pets
                    </div>
                ))}
            </div>
            <p className="text-gray-500 font-bold text-center text-base tracking-wide max-w-sm leading-relaxed animate-pulse">
                {loadingPhrase}
            </p>
        </div>
    );
};
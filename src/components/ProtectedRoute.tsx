import { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from './LoadingScreen';

export function ProtectedRoute() {
    const { user, loading } = useAuth();
    const [shouldRender, setShouldRender] = useState(loading);
    const [isFadingOut, setIsFadingOut] = useState(false);

    useEffect(() => {
        if (!loading) {
            setIsFadingOut(true);
            const timer = setTimeout(() => {
                setShouldRender(false);
                setIsFadingOut(false);
            }, 200);
            return () => clearTimeout(timer);
        } else {
            setShouldRender(true);
            setIsFadingOut(false);
        }
    }, [loading]);

    if (shouldRender && loading) {
        return <LoadingScreen isFadingOut={false} />;
    }

    return (
        <>
            {user ? <Outlet /> : <Navigate to="/login" replace />}
            {shouldRender && <LoadingScreen isFadingOut={isFadingOut} />}
        </>
    );
}
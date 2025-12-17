import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "./Components/Hooks/useAuth.js";

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, isLoading } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    return children;
};

export default ProtectedRoute;
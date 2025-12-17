import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from "./Components/Hooks/useAuth.js";

const AdminRoute = ({ children }) => {
    const { isLoggedIn, isLoading, userRole } = useAuth();
    const location = useLocation();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (!isLoggedIn) {
        return <Navigate to="/login" replace state={{ from: location }} />;
    }

    const isAdmin = userRole?.includes('ROLE_ADMIN');

    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;
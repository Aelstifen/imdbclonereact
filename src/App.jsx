import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import './App.css';

import {AuthProvider} from "./Context/AuthProvider.jsx";
import { ToastProvider } from "./Components/ToastProvider.jsx";
import ProtectedRoute from "./ProtectedRoute.jsx";
import AdminRoute from './AdminRoute.jsx';

import Header from './Components/Header.jsx';
import Menu from './Components/Menu.jsx';
import AdminLayout from "./Components/AdminLayout.jsx";

import HomePage from './Components/HomePage.jsx';
import SamplePage from './Components/SampleBrowsePage.jsx';
import ShowDetailsPage from './Components/Details.jsx';
import LoginPage from './Components/SampleLoginPage.jsx';
import SignupPage from './Components/SampleSignUpPage.jsx';
import Watchlist from './Components/Watchlist.jsx';
import UserProfile from './Components/UserProfile.jsx';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isAdminRoute = location.pathname.startsWith('/admin');

    return (
        <div className="App">
            {!isMenuOpen && !isAdminRoute && (
                <Header toggleMenu={toggleMenu} showSearch={location.pathname === '/'} />
            )}
            {isMenuOpen && <Menu onClose={toggleMenu} />}

            <Routes>
                <Route
                    path="/admin/*"
                    element={
                        <AdminRoute>
                            <AdminLayout toggleMenu={toggleMenu} />
                        </AdminRoute>
                    }
                />

                <Route
                    path="/watchlist"
                    element={
                        <ProtectedRoute>
                            <Watchlist />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/userprofile"
                    element={
                        <ProtectedRoute>
                            <UserProfile />
                        </ProtectedRoute>
                    }
                />

                <Route path="/" element={<HomePage />} />
                <Route path="/top-movies" element={<SamplePage />} />
                <Route path="/trending-movies" element={<SamplePage />} />
                <Route path="/top-tv-shows" element={<SamplePage />} />
                <Route path="/trending-tv-shows" element={<SamplePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/title/:id" element={<ShowDetailsPage />} />
            </Routes>
        </div>
    );
}

function AppWrapper() {
    return (
        <QueryClientProvider client={queryClient}>
            <ToastProvider>
                <Router>
                    <AuthProvider>
                        <App />
                    </AuthProvider>
                </Router>
            </ToastProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}

export default AppWrapper;

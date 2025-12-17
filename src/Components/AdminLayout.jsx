import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiService from './Services/apiServices.js';
import AdminDashboard from './AdminDashboard.jsx';
import Header from './Header.jsx';
import './AdminLayout.css';
import './AdminShared.css';
import { AdminContext } from "../Context/AdminContext.js";

const AdminLayout = ({ toggleMenu }) => {
    const [adminSearchTerm, setAdminSearchTerm] = useState('');
    const [adminSection, setAdminSection] = useState('title');

    const { data: allGenres = [], isLoading: genresLoading } = useQuery({
        queryKey: ['genres'],
        queryFn: apiService.getGenres,
        staleTime: 1000 * 60 * 60,
        refetchOnWindowFocus: false,
    });

    return (
        <AdminContext.Provider
            value={{
                adminSearchTerm,
                setAdminSearchTerm,
                adminSection,
                setAdminSection,
                allGenres,
                genresLoading
            }}
        >
            <div className="admin-layout">
                <Header
                    toggleMenu={toggleMenu}
                    adminSearchTerm={adminSearchTerm}
                    onAdminSearchChange={setAdminSearchTerm}
                    adminSection={adminSection}
                    onAdminSectionChange={setAdminSection}
                />
                <div className="admin-main-content-wrapper">
                    <main className="admin-content-area">
                        <AdminDashboard />
                    </main>
                </div>
            </div>
        </AdminContext.Provider>
    );
};

export default AdminLayout;
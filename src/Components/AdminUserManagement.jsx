import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiService from "./Services/apiServices.js";
import {useAdmin} from "./Hooks/useAdmin.js";
import AdminUserDetailsModal from "./AdminUserDetailsModal.jsx";
import AdminUserWatchlistModal from "./AdminUserWatchlistModal.jsx";
import './AdminUserManagement.css';

const AdminUserManagement = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [modalState, setModalState] = useState({ type: null, userId: null });
    const { adminSearchTerm: searchTerm } = useAdmin();

    const { data: pageData, isLoading, error, refetch } = useQuery({
        queryKey: ['adminUsers', currentPage, searchTerm],
        queryFn: () => apiService.getAdminUsers(currentPage, 10, searchTerm),
        keepPreviousData: true,
    });

    const users = pageData?.content || [];
    const totalPages = pageData?.totalPages || 0;

    useEffect(() => {
        setCurrentPage(0);
    }, [searchTerm]);

    const openModal = (type, userId) => setModalState({ type, userId });
    const closeModal = () => setModalState({ type: null, userId: null });
    const handleSaveSuccess = () => {
        refetch();
    };

    const handlePreviousPage = () => setCurrentPage(p => Math.max(0, p - 1));
    const handleNextPage = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

    const renderContent = () => {
        if (isLoading) {
            return (
                <tr>
                    <td colSpan="5" className="admin-table-message">Loading users...</td>
                </tr>
            );
        }

        if (error) {
            return (
                <tr>
                    <td colSpan="5" className="admin-table-message error">
                        Error: {error.message}
                        <button onClick={() => refetch()} className="admin-user-button">Retry</button>
                    </td>
                </tr>
            );
        }

        if (users.length === 0) {
            return (
                <tr>
                    <td colSpan="5" className="admin-table-message">No users found.</td>
                </tr>
            );
        }

        return users.map(user => (
            <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.watchlistEntryCount}</td>
                <td className="admin-user-actions">
                    <button
                        onClick={() => openModal('profile', user.id)}
                        className="admin-user-button admin-button-details"
                    >
                        View Profile
                    </button>
                    <button
                        onClick={() => openModal('watchlist', user.id)}
                        className="admin-user-button admin-button-watchlist"
                    >
                        View Watchlist
                    </button>
                </td>
            </tr>
        ));
    };

    return (
        <div className="admin-user-management-container">
            <div className="admin-user-list-header">
                <h2>User Management</h2>
            </div>

            <table className="admin-user-table">
                <thead>
                <tr>
                    <th>User ID</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Watchlist Items</th>
                    <th>Actions</th>
                </tr>
                </thead>
                <tbody>
                {renderContent()}
                </tbody>
            </table>

            {totalPages > 1 && (
                <div className="admin-pagination-controls">
                    <button
                        onClick={handlePreviousPage}
                        disabled={currentPage === 0 || isLoading}
                        className="admin-pagination-button"
                    >
                        Previous
                    </button>
                    <span>Page {currentPage + 1} of {totalPages}</span>
                    <button
                        onClick={handleNextPage}
                        disabled={currentPage >= totalPages - 1 || isLoading}
                        className="admin-pagination-button"
                    >
                        Next
                    </button>
                </div>
            )}

            {modalState.type === 'profile' && (
                <AdminUserDetailsModal
                    userId={modalState.userId}
                    onClose={closeModal}
                    onSaveSuccess={handleSaveSuccess}
                />
            )}
            {modalState.type === 'watchlist' && (
                <AdminUserWatchlistModal
                    userId={modalState.userId}
                    onClose={closeModal}
                />
            )}
        </div>
    );
};

export default AdminUserManagement;
import React, {useRef} from 'react';
import {useQuery} from '@tanstack/react-query';
import apiService from './Services/apiServices.js';
import useOnClickOutside from "./Hooks/useOnClickOutside.js";
import './AdminUserModals.css';

const AdminUserWatchlistModal = ({userId, onClose}) => {
    const modalRef = useRef();

    useOnClickOutside(modalRef, onClose);

    const {data: watchlist, isLoading, error} = useQuery({
        queryKey: ['adminUserWatchlist', userId],
        queryFn: () => apiService.getAdminUserWatchlist(userId),
        enabled: !!userId,
    });

    const renderContent = () => {
        if (isLoading) return <div className="admin-modal-loading">Loading watchlist...</div>;
        if (error) return <div className="admin-modal-error">Error: {error.message}</div>;
        if (!watchlist || watchlist.length === 0) {
            return <div className="admin-modal-info-item">This user has no items in their watchlist.</div>;
        }

        return (
            <table className="admin-modal-table">
                <thead>
                <tr>
                    <th>Title ID</th>
                    <th>Primary Title</th>
                    <th>Category</th>
                    <th>Date Added</th>
                </tr>
                </thead>
                <tbody>
                {watchlist.map(item => (
                    <tr key={item.watchlistEntryId}>
                        <td>{item.tconst}</td>
                        <td>{item.primaryTitle}</td>
                        <td>{item.category}</td>
                        <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        );
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal" ref={modalRef}>
                <button className="admin-modal-close" onClick={onClose}>×</button>
                <h2 className="admin-modal-title">User Watchlist</h2>
                <div className="admin-modal-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminUserWatchlistModal;


import React, { useRef, useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from './Services/apiServices.js';
import useOnClickOutside from "./Hooks/useOnClickOutside.js";
import { useToast } from './Hooks/useToast.js';
import './AdminUserModals.css';

const AdminUserDetailsModal = ({ userId, onClose, onSaveSuccess }) => {
    const modalRef = useRef();
    const [selectedRole, setSelectedRole] = useState('');
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    useOnClickOutside(modalRef, onClose);

    const { data: user, isLoading, error } = useQuery({
        queryKey: ['adminUserDetail', userId],
        queryFn: () => apiService.getAdminUserDetails(userId),
        enabled: !!userId,
        onSuccess: (data) => {
            if (data?.role) {
                setSelectedRole(data.role);
            }
        },
    });

    const updateRoleMutation = useMutation({
        mutationFn: (newRole) => apiService.updateAdminUserRole(userId, newRole),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminUserDetail', userId]);
            queryClient.invalidateQueries(['adminUsers']);
            showToast('User role updated successfully', 'success');
            if (typeof onSaveSuccess === 'function') {
                onSaveSuccess();
            }
        },
        onError: (err) => {
            const errorMsg = err?.response?.data?.message || err?.message || 'Failed to update user role';
            showToast(errorMsg, 'error');
        },
    });

    const deleteUserMutation = useMutation({
        mutationFn: () => apiService.deleteAdminUser(userId),
        onSuccess: () => {
            queryClient.invalidateQueries(['adminUsers']);
            showToast('User deleted successfully', 'success');
            if (typeof onSaveSuccess === 'function') {
                onSaveSuccess();
            }
            onClose();
        },
        onError: (err) => {
            const errorMsg = err?.response?.data?.message || err?.message || 'Failed to delete user';
            showToast(errorMsg, 'error');
            setShowDeleteConfirm(false);
        },
    });

    const handleRoleUpdate = () => {
        if (!selectedRole || selectedRole === user.role) {
            return;
        }
        updateRoleMutation.mutate(selectedRole);
    };

    const handleDelete = () => {
        deleteUserMutation.mutate();
    };

    const availableRoles = ['USER', 'ADMIN', 'MODERATOR'];

    const renderContent = () => {
        if (isLoading) return <div className="admin-modal-loading">Loading profile...</div>;
        if (error) return <div className="admin-modal-error">Error: {error.message}</div>;
        if (!user) return null;

        return (
            <>
                <div className="admin-modal-info-grid">
                    <div className="admin-modal-info-item">
                        <strong>User ID:</strong>
                        <span>{user.id}</span>
                    </div>
                    <div className="admin-modal-info-item">
                        <strong>Email:</strong>
                        <span>{user.email}</span>
                    </div>
                    <div className="admin-modal-info-item">
                        <strong>Role:</strong>
                        <select
                            value={selectedRole}
                            onChange={(e) => setSelectedRole(e.target.value)}
                            disabled={updateRoleMutation.isLoading}
                            className="admin-role-select"
                        >
                            {availableRoles.map(role => (
                                <option key={role} value={role}>{role}</option>
                            ))}
                        </select>
                    </div>
                    <div className="admin-modal-info-item">
                        <strong>Watchlist Items:</strong>
                        <span>{user.watchlistEntryCount}</span>
                    </div>
                </div>
                <div className="admin-modal-actions">
                    <button
                        onClick={handleRoleUpdate}
                        disabled={updateRoleMutation.isLoading || selectedRole === user.role}
                        className="admin-modal-button admin-button-save"
                    >
                        {updateRoleMutation.isLoading ? 'Updating...' : 'Update Role'}
                    </button>
                    <button
                        onClick={() => setShowDeleteConfirm(true)}
                        disabled={deleteUserMutation.isLoading}
                        className="admin-modal-button admin-button-delete"
                    >
                        Delete User
                    </button>
                </div>
                {showDeleteConfirm && (
                    <div className="admin-delete-confirm">
                        <p>Are you sure you want to delete this user? This action cannot be undone.</p>
                        <div className="admin-delete-confirm-buttons">
                            <button
                                onClick={handleDelete}
                                disabled={deleteUserMutation.isLoading}
                                className="admin-modal-button admin-button-delete"
                            >
                                {deleteUserMutation.isLoading ? 'Deleting...' : 'Confirm Delete'}
                            </button>
                            <button
                                onClick={() => setShowDeleteConfirm(false)}
                                disabled={deleteUserMutation.isLoading}
                                className="admin-modal-button admin-button-cancel"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </>
        );
    };

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal" ref={modalRef}>
                <button className="admin-modal-close" onClick={onClose}>×</button>
                <h2 className="admin-modal-title">User Profile</h2>
                <div className="admin-modal-content">
                    {renderContent()}
                </div>
            </div>
        </div>
    );
};

export default AdminUserDetailsModal;


import React from 'react';
import './UserProfile.css';
import { useAuth } from './Hooks/useAuth.js';
import { useToast } from './Hooks/useToast.js';

const UserProfile = () => {
    const { email } = useAuth();
    const { showToast } = useToast();
    const userInitial = email ? email.charAt(0).toUpperCase() : 'U';

    const handleSaveChanges = (e) => {
        e.preventDefault();
        showToast('This feature is not implemented yet', 'info');
    };

    const handleDeleteAccount = () => {
        showToast('This feature is not implemented yet', 'info');
    };

    return (
        <div className="account-panel">
            <h2>Account Settings</h2>

            <div className="user-info">
                <div className="avatar-placeholder">
                    {userInitial}
                </div>
                <div>
                    <p><strong>Email:</strong> {email || 'Loading...'}</p>
                </div>
            </div>

            <hr />

            <form className="account-form" onSubmit={handleSaveChanges}>
                <label>
                    Change Email:
                    <input type="email" placeholder="Enter new email" />
                </label>

                <label>
                    Change Password:
                    <input type="password" placeholder="Enter new password" />
                </label>

                <button type="submit">Save Changes</button>
            </form>

            <hr />

            <button className="delete-btn" onClick={handleDeleteAccount}>Delete Account</button>
        </div>
    );
};

export default UserProfile;
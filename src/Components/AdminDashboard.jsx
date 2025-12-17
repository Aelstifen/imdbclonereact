import React, {useState} from 'react';
import { useAdmin } from './Hooks/useAdmin.js';
import AdminTitleManagement from './AdminTitleManagement';
import AdminActorManagement from './AdminActorManagement';
import AdminUserManagement from './AdminUserManagement';
import AdminAddTitleModal from './AdminAddTitleModal';
import AdminAddActorModal from './AdminAddActorModal';
import './AdminDashboard.css';

const AdminDashboard = () => {
    const [modalState, setModalState] = useState({type: null, data: null});
    const [refreshKey, setRefreshKey] = useState(0);

    const { adminSection } = useAdmin();

    const openModal = (type) => setModalState({type, data: null});
    const handleCloseModal = () => setModalState({type: null, data: null});
    const handleSaveSuccess = () => {
        handleCloseModal();
        setRefreshKey(oldKey => oldKey + 1);
    };

    const renderContent = () => {
        switch (adminSection) {
            case 'title':
                return <AdminTitleManagement key={refreshKey} />;
            case 'actor':
                return <AdminActorManagement />;
            case 'user':
                return <AdminUserManagement />;
            default:
                return <AdminTitleManagement key={refreshKey} />;
        }
    };

    return (
        <div className="admin-dashboard-container">
            <div className="admin-main-header">
                <h1 className="admin-dashboard-heading">Admin Management</h1>
                <div className="admin-actions-header">
                    <button onClick={() => openModal('addTitle')} className="admin-button-add">
                        + Add New Title
                    </button>
                    <button onClick={() => openModal('addActor')} className="admin-button-add">
                        + Add New Actor
                    </button>
                </div>
            </div>

            <main className="admin-dashboard-content">
                {renderContent()}
            </main>

            {modalState.type === 'addTitle' && <AdminAddTitleModal
                onClose={handleCloseModal}
                onSaveSuccess={handleSaveSuccess}
            />}
            {modalState.type === 'addActor' && <AdminAddActorModal onClose={handleCloseModal} onSaveSuccess={handleSaveSuccess} />}
        </div>
    );
};

export default AdminDashboard;
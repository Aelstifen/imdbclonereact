import React, { useState, useEffect, useRef } from 'react';
import apiService from "./Services/apiServices.js";
import './AdminDetailsModal.css';
import useOnClickOutside from "./Hooks/useOnClickOutside.js";
import TitleForm from "./TitleForm.jsx";

const AdminDetailsList = ({ selectedTitle, onClose, onSaveSuccess, onDeleteSuccess, allGenres, genresLoading }) => {
    const [localTitleDetails, setLocalTitleDetails] = useState(selectedTitle);
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState(null);
    const modalRef = useRef();

    useOnClickOutside(modalRef, onClose);

    useEffect(() => {
        if (selectedTitle) {
            setLocalTitleDetails({
                ...selectedTitle,
                genres: Array.isArray(selectedTitle.genres)
                    ? selectedTitle.genres
                    : (selectedTitle.genres ? selectedTitle.genres.split(',').map(g => g.trim()) : [])
            });
        }
    }, [selectedTitle]);

    if (!selectedTitle || !localTitleDetails) {
        return null;
    }

    const handleSave = async () => {
        setIsSaving(true);
        setError(null);
        try {
            const payload = {
                ...localTitleDetails,
                genres: localTitleDetails.genres.join(',')
            };
            await apiService.updateTitle(localTitleDetails.tconst, payload);
            onSaveSuccess(payload);
            onClose();
        } catch (err) {
            const errorMsg = err.response?.data?.message || "Please check the console for details.";
            setError(`Failed to save: ${errorMsg}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleDelete = async () => {
        if (window.confirm(`Are you sure you want to delete "${selectedTitle.primaryTitle}"?`)) {
            setIsSaving(true);
            setError(null);
            try {
                await apiService.deleteTitle(selectedTitle.tconst);
                onDeleteSuccess();
                onClose();
            } catch (err) {
                const errorMsg = err.response?.data?.message || "Please check the console for details.";
                setError(`Failed to delete: ${errorMsg}`);
            } finally {
                setIsSaving(false);
            }
        }
    };

    return (
        <div className="admin-details-modal-overlay">
            <div className="admin-details-modal" ref={modalRef}>
                <button className="admin-details-close-modal" onClick={onClose}>×</button>
                <TitleForm
                    titleData={localTitleDetails}
                    onDataChange={setLocalTitleDetails}
                    allGenres={allGenres}
                    genresLoading={genresLoading}
                />
                {error && <p className="admin-error-message" style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                <div className="admin-details-actions">
                    <button className="admin-details-save-btn" onClick={handleSave} disabled={isSaving}>
                        {isSaving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button className="admin-details-delete-btn" onClick={handleDelete} disabled={isSaving}>
                        {isSaving ? 'Deleting...' : 'Delete Title'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminDetailsList;
import React, { useState, useEffect } from 'react';
import './AdminActorsModal.css';
import apiService from "./Services/apiServices.js";

const AdminActorsList = ({ selectedTitle, onClose, onSaveSuccess }) => {
    const tconst = selectedTitle?.tconst || '';
    const primaryTitle = selectedTitle?.primaryTitle;

    const [actors, setActors] = useState([]);
    const [error, setError] = useState(null);
    const [saveMessage, setSaveMessage] = useState('');

    useEffect(() => {
        setActors(selectedTitle?.actors || []);
        setError(null);
        setSaveMessage('');
    }, [selectedTitle]);

    if (!selectedTitle) return null;

    const handleRemove = (nconstToRemove) => {
        setActors(prev => prev.filter(actor => actor.nconst !== nconstToRemove));
    };

    const handleAdd = () => {
        setActors(prev => [...prev, { nconst: `new-${Date.now()}`, primaryName: '' }]);
    };

    const handleChange = (e, nconstToUpdate) => {
        setActors(prev =>
            prev.map(actor =>
                actor.nconst === nconstToUpdate
                    ? { ...actor, primaryName: e.target.value }
                    : actor
            )
        );
    };

    const handleSave = async () => {
        setSaveMessage('Saving changes...');
        setError(null);
        try {
            const actorsToSave = actors
                .filter(actor => actor.primaryName?.trim())
                .map(actor => ({
                    nconst: actor.nconst.startsWith('new-') ? null : actor.nconst,
                    primaryName: actor.primaryName.trim()
                }));

            const savedActorsData = await apiService.updateTitleActors(tconst, actorsToSave);

            if (onSaveSuccess) {
                const updatedTitle = { ...selectedTitle, actors: savedActorsData };
                onSaveSuccess(updatedTitle);
            }

            setSaveMessage('Changes saved successfully!');
            setTimeout(() => {
                setSaveMessage('');
            }, 1500);

        } catch (err) {
            setError(`Failed to save changes: ${err.message || 'Check console'}.`);
            setSaveMessage('');
        }
    };

    return (
        <div className="admin-actors-modal-overlay">
            <div className="admin-actors-modal">
                <button className="admin-actors-close-modal" onClick={onClose}>&times;</button>
                <h2 className="admin-actors-title">Manage Actors for "{primaryTitle}"</h2>

                <div className="admin-actors-list-wrapper">
                    {actors.map(actor => (
                        <div className="admin-actors-row" key={actor.nconst}>
                            <input
                                className="admin-actors-name"
                                type="text"
                                value={actor.primaryName || ''}
                                onChange={(e) => handleChange(e, actor.nconst)}
                            />
                            <button
                                className="admin-actors-remove-btn"
                                onClick={() => handleRemove(actor.nconst)}
                            >&times;</button>
                        </div>
                    ))}
                </div>

                {saveMessage && <p className="admin-actors-save-message">{saveMessage}</p>}
                {error && <p className="admin-actors-error-message">{error}</p>}

                <div className="admin-actors-action-buttons">
                    <button className="admin-actors-add-btn" onClick={handleAdd}>Add Actor</button>
                    <button className="admin-actors-save-all-btn" onClick={handleSave}>Save Changes</button>
                </div>
            </div>
        </div>
    );
};

export default AdminActorsList;
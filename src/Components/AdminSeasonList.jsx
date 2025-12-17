import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import './AdminSeasonList.css';
import apiService from "./Services/apiServices.js";

const AdminSeasonList = ({ selectedTitle, onClose }) => {
    const [seasons, setSeasons] = useState(selectedTitle.numSeasons || 0);
    const [episodes, setEpisodes] = useState(selectedTitle.numEpisodes || 0);
    const [feedback, setFeedback] = useState({ message: '', type: '' });

    const queryClient = useQueryClient();

    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") onClose();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [onClose]);

    useEffect(() => {
        setSeasons(selectedTitle.numSeasons || 0);
        setEpisodes(selectedTitle.numEpisodes || 0);
        setFeedback({ message: '', type: '' });
    }, [selectedTitle]);

    const saveMutation = useMutation({
        mutationFn: (updatedTitle) =>
            apiService.updateTitle(selectedTitle.tconst, updatedTitle),
        onSuccess: () => {
            setFeedback({ message: 'Season info saved successfully!', type: 'success' });
            queryClient.invalidateQueries(['titles']);
            setTimeout(() => {
                setFeedback({ message: '', type: '' });
                onClose();
            }, 2000);
        },
        onError: (err) => {
            const errorMsg = err?.response?.data?.message || err?.message || "Unexpected error";
            setFeedback({ message: `Error saving: ${errorMsg}`, type: 'error' });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: () =>
            apiService.updateTitle(selectedTitle.tconst, {
                ...selectedTitle,
                numSeasons: 0,
                numEpisodes: 0,
            }),
        onSuccess: () => {
            setSeasons(0);
            setEpisodes(0);
            setFeedback({ message: 'Season info deleted successfully!', type: 'success' });
            queryClient.invalidateQueries(['titles']);
            setTimeout(() => onClose(), 1500);
        },
        onError: (err) => {
            const errorMsg = err?.response?.data?.message || err?.message || "Unexpected error";
            setFeedback({ message: `Error deleting: ${errorMsg}`, type: 'error' });
        },
    });

    const getFeedbackClass = () => {
        switch (feedback.type) {
            case 'error':
                return 'admin-season-error-message';
            case 'success':
                return 'admin-season-save-message';
            default:
                return '';
        }
    };

    return (
        <div className="admin-season-modal-overlay">
            <div className="admin-season-modal-wrapper">
                <button
                    className="admin-season-close-modal"
                    onClick={onClose}
                    aria-label="Close season info modal"
                >
                    &times;
                </button>

                <div className="admin-season-modal">
                    <h2>Season Info for {selectedTitle.primaryTitle}</h2>

                    <div className="form-group">
                        <label htmlFor="seasons">Number of Seasons</label>
                        <input
                            type="number"
                            id="seasons"
                            value={seasons}
                            min="0"
                            onChange={(e) => {
                                const value = e.target.value === "" ? "" : Math.max(0, Number(e.target.value));
                                setSeasons(value);
                            }}
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="episodes">Number of Episodes</label>
                        <input
                            type="number"
                            id="episodes"
                            value={episodes}
                            min="0"
                            onChange={(e) => {
                                const value = e.target.value === "" ? "" : Math.max(0, Number(e.target.value));
                                setEpisodes(value);
                            }}
                        />
                    </div>

                    {feedback.message && (
                        <p aria-live="polite" className={getFeedbackClass()}>
                            {feedback.message}
                        </p>
                    )}

                    <div className="actions">
                        <button
                            className="save-btn"
                            onClick={() =>
                                saveMutation.mutate({
                                    ...selectedTitle,
                                    numSeasons: seasons,
                                    numEpisodes: episodes,
                                })
                            }
                            disabled={saveMutation.isLoading}
                        >
                            {saveMutation.isLoading ? 'Saving...' : 'Save'}
                        </button>
                        <button
                            className="delete-btn"
                            onClick={() => deleteMutation.mutate()}
                            disabled={deleteMutation.isLoading}
                        >
                            {deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminSeasonList;

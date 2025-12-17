import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from './Services/apiServices.js';

const AdminAddTitleModal = ({ onClose, onSaveSuccess }) => {
    const queryClient = useQueryClient();

    const [newTitle, setNewTitle] = useState({
        primaryTitle: '',
        imageLink: '',
        titleType: 'movie',
        genres: [],
        runtimeMinutes: '',
        startYear: '',
        isAdult: false,
        numSeasons: '',
        numEpisodes: ''
    });

    const [error, setError] = useState('');

    const { data: allGenres = [], isLoading: genresLoading } = useQuery({
        queryKey: ['genres'],
        queryFn: apiService.getGenres
    });

    const addTitleMutation = useMutation({
        mutationFn: apiService.addTitle,
        onSuccess: () => {
            queryClient.invalidateQueries(['titles']);
            onSaveSuccess();
            onClose();
        },
        onError: (err) => {
            const errorMsg = err.response?.data?.message || 'An unexpected error occurred.';
            setError(`Failed to save: ${errorMsg}`);
        }
    });

    const toggleGenre = (genre) => {
        setNewTitle((prev) => {
            const alreadySelected = prev.genres.includes(genre);
            return {
                ...prev,
                genres: alreadySelected
                    ? prev.genres.filter((g) => g !== genre)
                    : [...prev.genres, genre]
            };
        });
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewTitle((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = () => {
        if (!newTitle.primaryTitle || !newTitle.startYear) {
            setError('Title Name and Start Year are required.');
            return;
        }

        const payload = {
            ...newTitle,
            genres: newTitle.genres.join(','),
            runtimeMinutes: newTitle.runtimeMinutes || null,
            startYear: newTitle.startYear || null,
            numSeasons: newTitle.numSeasons || null,
            numEpisodes: newTitle.numEpisodes || null
        };

        setError('');
        addTitleMutation.mutate(payload);
    };

    const showSeasonEpisodeFields =
        newTitle.titleType &&
        (newTitle.titleType.toLowerCase().includes('tv') ||
            newTitle.titleType.toLowerCase().includes('series'));

    return (
        <div className="admin-details-modal-overlay">
            <div className="admin-details-modal">
                <button className="admin-details-close-modal" onClick={onClose}>
                    ×
                </button>
                <div className="admin-details-header">
                    <div className="admin-details-poster">
                        <img
                            src={
                                newTitle.imageLink ||
                                'https://placehold.co/150x220/666/333?text=Add+Poster'
                            }
                            alt="Poster Preview"
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src =
                                    'https://placehold.co/150x220/666/333?text=Invalid+URL';
                            }}
                        />
                    </div>

                    <div className="admin-details-info">
                        <div className="admin-details-form-group">
                            <label>Title Name</label>
                            <input
                                type="text"
                                name="primaryTitle"
                                value={newTitle.primaryTitle}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-details-form-group">
                            <label>Image Link</label>
                            <input
                                type="text"
                                name="imageLink"
                                value={newTitle.imageLink}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-details-form-group">
                            <label>Title Type</label>
                            <input
                                type="text"
                                name="titleType"
                                value={newTitle.titleType}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-details-form-group">
                            <label>Genres</label>
                            <div className="genres-container">
                                {genresLoading ? (
                                    <p>Loading genres...</p>
                                ) : (
                                    allGenres.map((genre) => (
                                        <div
                                            key={genre}
                                            className={`genre-box ${
                                                newTitle.genres.includes(genre) ? 'selected' : ''
                                            }`}
                                            onClick={() => toggleGenre(genre)}
                                        >
                                            {genre}
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                        <div className="admin-details-form-group">
                            <label>Runtime (minutes)</label>
                            <input
                                type="number"
                                name="runtimeMinutes"
                                value={newTitle.runtimeMinutes}
                                onChange={handleInputChange}
                            />
                        </div>
                        <div className="admin-details-form-group">
                            <label>Start Year</label>
                            <input
                                type="number"
                                name="startYear"
                                value={newTitle.startYear}
                                onChange={handleInputChange}
                            />
                        </div>

                        {showSeasonEpisodeFields && (
                            <>
                                <div className="admin-details-form-group">
                                    <label>Number of Seasons</label>
                                    <input
                                        type="number"
                                        name="numSeasons"
                                        value={newTitle.numSeasons}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>
                                <div className="admin-details-form-group">
                                    <label>Number of Episodes</label>
                                    <input
                                        type="number"
                                        name="numEpisodes"
                                        value={newTitle.numEpisodes}
                                        onChange={handleInputChange}
                                        min="0"
                                    />
                                </div>
                            </>
                        )}

                        <div className="admin-details-checkbox-group">
                            <input
                                type="checkbox"
                                name="isAdult"
                                id="isAdult"
                                checked={newTitle.isAdult}
                                onChange={handleInputChange}
                            />
                            <label htmlFor="isAdult">Is Adult?</label>
                        </div>
                    </div>
                </div>

                {error && (
                    <p
                        className="admin-error-message"
                        style={{ color: 'red', textAlign: 'center', marginTop: '10px' }}
                    >
                        {error}
                    </p>
                )}

                <div className="admin-details-actions">
                    <button
                        onClick={onClose}
                        className="admin-modal-button admin-button-danger"
                        disabled={addTitleMutation.isLoading}
                    >
                        Cancel
                    </button>
                    <button
                        className="admin-modal-button admin-button-primary"
                        onClick={handleSave}
                        disabled={addTitleMutation.isLoading}
                    >
                        {addTitleMutation.isLoading ? 'Saving...' : 'Save Title'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminAddTitleModal;

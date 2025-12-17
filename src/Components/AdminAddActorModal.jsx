import React, { useEffect, useState } from 'react';
import apiService from './Services/apiServices.js';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import { useToast } from './Hooks/useToast.js';

const AdminAddActorModal = ({ onClose, onSaveSuccess, editNconst = null }) => {
    const [newActor, setNewActor] = useState({
        nconst: '',
        primaryName: '',
        birthYear: '',
        deathYear: '',
        primaryProfession: '',
        knownForTitles: ''
    });

    const { data: actorDetails, isLoading: actorLoading } = useQuery({
        queryKey: editNconst ? ['adminActor', editNconst] : ['adminActor', 'new'],
        queryFn: () => (editNconst ? apiService.getAdminActorDetails(editNconst) : Promise.resolve(null)),
        enabled: !!editNconst,
        staleTime: 0
    });

    useEffect(() => {
        if (actorDetails) {
            const prof = Array.isArray(actorDetails.primaryProfession)
                ? actorDetails.primaryProfession.join(',')
                : (actorDetails.primaryProfession || '');

            const known = Array.isArray(actorDetails.knownForTitles)
                ? actorDetails.knownForTitles.map(t => t.tconst || t).join(',')
                : (actorDetails.knownForTitles || '');

            setNewActor({
                nconst: actorDetails.nconst || '',
                primaryName: actorDetails.primaryName || '',
                birthYear: actorDetails.birthYear ?? '',
                deathYear: actorDetails.deathYear ?? '',
                primaryProfession: prof,
                knownForTitles: known
            });
        }
    }, [actorDetails]);

    const [error, setError] = useState('');
    const queryClient = useQueryClient();
    const { showToast } = useToast();

    const addActorMutation = useMutation({
        mutationFn: (actor) => apiService.addActor(actor),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['adminActors'] });
            if (typeof onSaveSuccess === 'function') onSaveSuccess(data);
            showToast('Actor saved successfully', 'success');
            onClose();
        },
        onError: (err) => {
            const msg = err?.response?.data?.message || 'Unexpected error saving actor.';
            setError(msg);
            showToast(msg, 'error');
        }
    });

    const updateActorMutation = useMutation({
        mutationFn: ({ nconst, actor }) => apiService.updateActor(nconst, actor),
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['adminActors'] });
            queryClient.invalidateQueries({ queryKey: ['adminActor', editNconst] });
            if (typeof onSaveSuccess === 'function') onSaveSuccess(data);
            showToast('Actor updated successfully', 'success');
            onClose();
        },
        onError: (err) => {
            const msg = err?.response?.data?.message || 'Unexpected error updating actor.';
            setError(msg);
            showToast(msg, 'error');
        }
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewActor((prev) => ({ ...prev, [name]: value }));
    };

    const handleSave = () => {
        if (!newActor.primaryName.trim()) {
            setError('Actor name is required.');
            return;
        }

        if (newActor.primaryProfession && newActor.primaryProfession.trim()) {
            const profParts = newActor.primaryProfession.split(',').map(p => p.trim()).filter(Boolean);
            if (profParts.some(p => /[^a-zA-Z0-9\- ]/.test(p))) {
                setError('Primary profession contains invalid characters. Use comma-separated words (e.g., writer,animator).');
                return;
            }
        }

        if (newActor.knownForTitles && newActor.knownForTitles.trim()) {
            const titles = newActor.knownForTitles.split(',').map(t => t.trim()).filter(Boolean);
            const invalid = titles.some(t => !/^tt\d+$/i.test(t));
            if (invalid) {
                setError('Known for titles must be comma-separated tconst values (e.g., tt1234567).');
                return;
            }
        }

        const actorToSave = {
            primaryName: newActor.primaryName.trim(),
            birthYear: newActor.birthYear ? Number(newActor.birthYear) : null,
            deathYear: newActor.deathYear ? Number(newActor.deathYear) : null,
            primaryProfession: newActor.primaryProfession.trim() || null,
            knownForTitles: newActor.knownForTitles.trim() || null,
        };

        setError('');
        if (editNconst) {
            updateActorMutation.mutate({ nconst: editNconst, actor: actorToSave });
        } else {
            addActorMutation.mutate(actorToSave);
        }
    };

    const isSaving = addActorMutation.isLoading || updateActorMutation.isLoading || actorLoading;

    return (
        <div className="admin-modal-overlay">
            <div className="admin-modal-box">
                <h2 className="admin-modal-heading">{editNconst ? 'Edit Actor' : 'Add New Actor'}</h2>
                <div className="admin-details-form-grid">
                    {editNconst && (
                        <div className="admin-form-field">
                            <label>nconst</label>
                            <input type="text" name="nconst" value={newActor.nconst} readOnly />
                        </div>
                    )}

                    <div className="admin-form-field">
                        <label>Actor Name</label>
                        <input
                            type="text"
                            name="primaryName"
                            value={newActor.primaryName}
                            onChange={handleChange}
                            placeholder="e.g., Keanu Reeves"
                        />
                    </div>
                    <div className="admin-form-field">
                        <label>Birth Year</label>
                        <input
                            type="number"
                            name="birthYear"
                            value={newActor.birthYear}
                            onChange={handleChange}
                            placeholder="e.g., 1964"
                        />
                    </div>
                    <div className="admin-form-field">
                        <label>Death Year (if applicable)</label>
                        <input
                            type="number"
                            name="deathYear"
                            value={newActor.deathYear}
                            onChange={handleChange}
                            placeholder="e.g., 2020"
                        />
                    </div>
                    <div className="admin-form-field admin-form-field-full">
                        <label>Primary Profession (comma-separated: e.g., writer,animator)</label>
                        <input
                            type="text"
                            name="primaryProfession"
                            value={newActor.primaryProfession}
                            onChange={handleChange}
                            placeholder="e.g., writer,animator"
                        />
                    </div>
                    <div className="admin-form-field admin-form-field-full">
                        <label>Known For Titles (tconst, comma-separated)</label>
                        <input
                            type="text"
                            name="knownForTitles"
                            value={newActor.knownForTitles}
                            onChange={handleChange}
                            placeholder="e.g., tt0133093,tt0234215"
                        />
                    </div>
                </div>

                {error && <p className="admin-error-message">{error}</p>}

                <div className="admin-modal-actions">
                    <button
                        onClick={onClose}
                        className="admin-modal-button admin-button-cancel"
                        disabled={isSaving}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="admin-modal-button admin-button-save"
                        disabled={isSaving}
                    >
                        {isSaving ? 'Saving...' : 'Save Actor'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdminAddActorModal;

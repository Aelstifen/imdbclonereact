import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiService from './Services/apiServices.js';
import { useAdmin } from './Hooks/useAdmin.js';
import './AdminActorManagement.css';
import AdminAddActorModal from './AdminAddActorModal.jsx';

const useAdminActors = (searchTerm, currentPage) => {
    return useQuery({
        queryKey: ['adminActors', { search: searchTerm, page: currentPage }],
        queryFn: () => apiService.findActors(searchTerm, currentPage, 15),
        keepPreviousData: true
    });
};

const AdminActorManagement = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const { adminSearchTerm: searchTerm } = useAdmin();
    const { data, isLoading, isError, error } = useAdminActors(searchTerm, currentPage);

    const queryClient = useQueryClient();
    const [deletingId, setDeletingId] = useState(null);
    const [editingNconst, setEditingNconst] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const deleteActorMutation = useMutation({
        mutationFn: (nconst) => apiService.deleteActor(nconst),
        onMutate: async (nconst) => {
            setDeletingId(nconst);
            await queryClient.cancelQueries({ queryKey: ['adminActors'] });
            const previous = queryClient.getQueryData(['adminActors', { search: searchTerm, page: currentPage }]);
            if (previous) {
                const newData = { ...previous, content: previous.content.filter(a => a.nconst !== nconst) };
                queryClient.setQueryData(['adminActors', { search: searchTerm, page: currentPage }], newData);
            }
            return { previous };
        },
        onError: (err, nconst, context) => {
            console.error("Failed to delete actor:", err);
            if (context?.previous) {
                queryClient.setQueryData(['adminActors', { search: searchTerm, page: currentPage }], context.previous);
            }
        },
        onSettled: () => {
            setDeletingId(null);
            queryClient.invalidateQueries({ queryKey: ['adminActors'] });
        }
    });

    const handlePreviousPage = () => setCurrentPage(p => Math.max(0, p - 1));

    const handleNextPage = () => {
        if (data && !data.last) {
            setCurrentPage(p => p + 1);
        }
    };

    const handleDelete = (nconst) => {
        if (window.confirm("Are you sure you want to delete this actor?")) {
            deleteActorMutation.mutate(nconst);
        }
    };

    const handleEdit = (nconst) => {
        setEditingNconst(nconst);
        setShowModal(true);
    };

    const handleModalClose = () => {
        setShowModal(false);
        setEditingNconst(null);
    };

    const handleSaveSuccess = () => {
        queryClient.invalidateQueries({ queryKey: ['adminActors'] });
    };

    if (isLoading) {
        return <div className="actor-mgmt__message-container"><p>Loading actors...</p></div>;
    }

    if (isError) {
        return <div className="actor-mgmt__message-container actor-mgmt__error-page"><p>{error.message}</p></div>;
    }

    const actors = data?.content || [];
    const totalPages = data?.totalPages || 0;

    return (
        <div className="actor-mgmt__container">
            {actors.length === 0 ? (
                <div className="actor-mgmt__message-container">
                    <p>No actors found.</p>
                </div>
            ) : (
                <>
                    <div className="actor-mgmt__grid">
                        {actors.map(actor => (
                            <div key={actor.nconst} className="actor-mgmt__card">
                                <img
                                    src={actor.imageUrl || `https://placehold.co/150x220/2c3138/e1e3e6?text=${actor.primaryName.charAt(0)}`}
                                    alt={actor.primaryName}
                                    className="actor-mgmt__card-img"
                                    onError={(e) => { e.target.onerror = null; e.target.src = 'https://placehold.co/150x220/2c3138/e1e3e6?text=No+Img'; }}
                                />
                                <div className="actor-mgmt__card-info">
                                    <p className="actor-mgmt__card-name">{actor.primaryName}</p>
                                    <div className="actor-mgmt__card-actions">
                                        <button onClick={() => handleEdit(actor.nconst)} className="actor-mgmt__button">Edit</button>
                                        <button
                                            onClick={() => handleDelete(actor.nconst)}
                                            className="actor-mgmt__button actor-mgmt__button--danger"
                                            disabled={deletingId === actor.nconst}
                                        >
                                            {deletingId === actor.nconst ? 'Deleting...' : 'Delete'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div className="actor-mgmt__pagination-controls">
                            <button
                                onClick={handlePreviousPage}
                                disabled={currentPage === 0}
                                className="actor-mgmt__pagination-button"
                            >
                                Previous
                            </button>
                            <span>Page {currentPage + 1} of {totalPages}</span>
                            <button
                                onClick={handleNextPage}
                                disabled={currentPage >= totalPages - 1}
                                className="actor-mgmt__pagination-button"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
            {showModal && (
                <AdminAddActorModal
                    editNconst={editingNconst}
                    onClose={handleModalClose}
                    onSaveSuccess={handleSaveSuccess}
                />
            )}
        </div>
    );
};

export default AdminActorManagement;
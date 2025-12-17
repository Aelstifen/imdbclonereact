import React, { useState, useEffect} from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiService from './Services/apiServices.js';
import { useAdmin } from './Hooks/useAdmin.js';
import './AdminTitleManagement.css';

import AdminFilterBar from './AdminFilterBar';
import AdminActorsList from './AdminActorsList';
import AdminDetailsList from './AdminDetailsList';

const initialFilterState = {
    search: '',
    genres: [],
    year: 'any',
    format: 'any',
    sortBy: 'popularity'
};

const AdminTitleManagement = () => {
    const [currentPage, setCurrentPage] = useState(0);
    const [modalState, setModalState] = useState({ type: null, data: null });
    const [filters, setFilters] = useState(initialFilterState);

    const { adminSearchTerm, allGenres, genresLoading } = useAdmin();
    const queryClient = useQueryClient();
    const {
        data: pageData,
        isLoading: loading,
        error,
    } = useQuery({
        queryKey: ['adminTitles', filters, currentPage],
        queryFn: () => apiService.getAdminTitles(filters, currentPage, 12),
        keepPreviousData: true,
    });

    const titles = pageData?.content || [];
    const totalPages = pageData?.totalPages || 0;

    const handleSaveSuccess = () => {
        queryClient.invalidateQueries(['adminTitles']);
    };

    const handleDeleteSuccess = () => {
        queryClient.invalidateQueries(['adminTitles']);
        handleCloseModal();
    };

    const openModal = (type, data = {}) => setModalState({ type, data });
    const handleCloseModal = () => setModalState({ type: null, data: null });
    const handlePreviousPage = () => setCurrentPage(p => Math.max(0, p - 1));
    const handleNextPage = () => setCurrentPage(p => Math.min(totalPages - 1, p + 1));

    useEffect(() => {
        setFilters(currentFilters => ({
            ...currentFilters,
            search: adminSearchTerm
        }));
    }, [adminSearchTerm]);

    useEffect(() => {
        if (modalState.type) {
            document.body.style.overflow = 'hidden';
            document.body.classList.add('modal-open');
        } else {
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
        }

        return () => {
            document.body.style.overflow = '';
            document.body.classList.remove('modal-open');
        };
    }, [modalState.type]);

    return (
        <div className="admin-title-management-container">
            <AdminFilterBar
                onFilterChange={setFilters}
            />

            <div className="admin-content-area">
                {loading ? (
                    <div className="admin-message-container"><p>Loading titles...</p></div>
                ) : error ? (
                    <div className="admin-message-container admin-error-page">
                        <p>{error.message}</p>
                        <button onClick={() => queryClient.invalidateQueries(['adminTitles'])}>Retry</button>
                    </div>
                ) : titles.length === 0 ? (
                    <div className="admin-message-container">
                        <p className="admin-no-titles-message">No titles found.</p>
                    </div>
                ) : (
                    <>
                        <div className="admin-title-grid">
                            {titles.map((title) => (
                                <div className="admin-title-card" key={title.tconst}>
                                    <div className="admin-title-card-img-container">
                                        <img src={title.imageLink || 'https://placehold.co/80x100/888/fff?text=No+Img'}
                                             alt={title.primaryTitle || "Thumbnail"} className="admin-title-card-img"
                                             onError={(e) => {
                                                 e.target.onerror = null;
                                                 e.target.src = 'https://placehold.co/80x100/888/fff?text=No+Img';
                                             }}/>
                                    </div>
                                    <div className="admin-title-card-info">
                                        <div className="admin-title-card-name">{title.primaryTitle}</div>
                                        <div className="admin-title-card-buttons">
                                            <button onClick={() => openModal('details', title)}
                                                    className="admin-button admin-button-details">Details
                                            </button>
                                            <button onClick={() => openModal('actors', title)}
                                                    className="admin-button admin-button-actors">Actors
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {totalPages > 1 && (
                            <div className="admin-pagination-controls">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 0}
                                    className="admin-pagination-button"
                                >
                                    Previous
                                </button>
                                <span>Page {currentPage + 1} of {totalPages}</span>
                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage >= totalPages - 1}
                                    className="admin-pagination-button"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {modalState.type === 'details' &&
                <AdminDetailsList
                    selectedTitle={modalState.data}
                    onClose={handleCloseModal}
                    onSaveSuccess={handleSaveSuccess}
                    onDeleteSuccess={handleDeleteSuccess}
                    allGenres={allGenres}
                    genresLoading={genresLoading}
                />}
            {modalState.type === 'actors' && <AdminActorsList
                selectedTitle={modalState.data}
                onClose={handleCloseModal}
                onSaveSuccess={handleSaveSuccess}
            />}
        </div>
    );
};

export default AdminTitleManagement;
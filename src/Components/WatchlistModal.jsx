import React, { useEffect, useRef } from 'react';
import ReactDOM from 'react-dom';
import './WatchlistModal.css';
import apiService from "./Services/apiServices.js";
import { useToast } from './Hooks/useToast.js';
import { useAuth } from './Hooks/useAuth.js';

const CATEGORIES = ['Watching', 'Dropped', 'Paused', 'Planning'];

const WatchlistModal = ({ onClose, onSelect, titleId, existingCategory }) => {
    const modalRef = useRef(null);
    const { showToast } = useToast();
    const { isLoggedIn } = useAuth();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    const handleCategoryClick = async (category) => {
        if (!isLoggedIn) {
            showToast('You must be signed in to add to watchlist.', 'error');
            onClose();
            return;
        }

        try {
            const response = await apiService.updateWatchlist(titleId, category);
            const wasDeleted = response?.isDeleted === true || response?.deleted === true;
            const returnedCategory = response?.category || category;

            if (wasDeleted) {
                if (typeof onSelect === 'function') onSelect(null);
                showToast(`Removed from ${returnedCategory}.`, 'success');
            } else {
                if (typeof onSelect === 'function') onSelect(returnedCategory);
                showToast(`Added to ${returnedCategory}!`, 'success');

                try {
                    await apiService.logTitleClick(titleId);
                } catch (error) {
                    console.error(`Error logging click for ${titleId}:`, error);
                }
            }

            onClose();
        } catch (error) {
            console.error('Failed to update watchlist:', error);
            showToast('Failed to update watchlist.', 'error');
        }
    };

    return ReactDOM.createPortal(
        <div className="watchlist-modal-overlay" onClick={onClose}>
            <div className="watchlist-modal" ref={modalRef} onClick={(e) => e.stopPropagation()}>
                <h3>Add to Watchlist</h3>
                <ul>
                    {CATEGORIES.map((cat) => (
                        <li
                            key={cat}
                            className={existingCategory === cat ? 'selected-category' : undefined}
                            onClick={() => handleCategoryClick(cat)}
                        >
                            {cat}
                        </li>
                    ))}
                </ul>
                <button className="watchlist-close" onClick={onClose}>Close</button>
            </div>
        </div>,
        document.body
    );
};

export default WatchlistModal;
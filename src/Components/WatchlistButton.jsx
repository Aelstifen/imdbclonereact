import React, { useState } from 'react';
import WatchlistModal from './WatchlistModal';
import { useAuth } from "./Hooks/useAuth.js";
import './WatchlistModal.css';
import { useToast } from './Hooks/useToast.js';
import apiService from './Services/apiServices.js';

const WatchlistButton = ({ showButton = true, onSelect, titleId }) => {
    const [isOpen, setIsOpen] = useState(false);
    const { isLoggedIn } = useAuth();
    const [existingCategory, setExistingCategory] = useState(null);
    const { showToast } = useToast();

    const handleClick = async (e) => {
        e.stopPropagation();
        if (!isLoggedIn) {
            showToast('You must be signed in to use the watchlist.', 'error');
            return;
        }

        try {
            const entry = await apiService.getWatchlistEntry(titleId);
            setExistingCategory(entry?.category || null);
        } catch (error) {
            console.error('Failed to fetch watchlist entry:', error);
            setExistingCategory(null);
        }

        setIsOpen(true);
    };

    const handleSelect = (category) => {
        setExistingCategory(category);
        if (typeof onSelect === 'function') onSelect(category);
    };

    return (
        <>
            {showButton && (
                <button className="watchlist-button" onClick={handleClick}>
                    ＋
                </button>
            )}
            {isOpen && (
                <WatchlistModal
                    onClose={() => setIsOpen(false)}
                    existingCategory={existingCategory}
                    onSelect={handleSelect}
                    titleId={titleId}
                />
            )}
        </>
    );
};

export default WatchlistButton;
import React from 'react';
import './CardSkeleton.css';

const CardSkeleton = () => {
    return (
        <div className="card-skeleton">
            <div className="skeleton-image"></div>
            <div className="skeleton-text"></div>
        </div>
    );
};

export default CardSkeleton;
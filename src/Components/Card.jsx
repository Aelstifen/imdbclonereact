import React, { useState } from 'react';
import './Card.css';

const Card = ({ item, renderOverlay, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <div
            className="card"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            onClick={onClick}
        >
            <div className="card-image-wrapper">
                <img
                    src={item.image}
                    className="card-image"
                    alt={item.title}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/200x300/1f2937/ffffff?text=No+Image';
                    }}
                />
                {isHovered && renderOverlay && (
                    <div>{renderOverlay()}</div>
                )}
            </div>
            <div className="card-title">{item.title}</div>
        </div>
    );
};

export default Card;
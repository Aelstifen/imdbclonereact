import React from 'react';
import './Card.css';

const Card = ({ image, title}) => {
    return (
        <div className="card">
            <img src={image} className="card-image"  alt={title} />
            <div className="card-content">
                <h3 className="card-title">{title}</h3>
            </div>
        </div>
    );
};

export default Card;

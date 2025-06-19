import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './Card';
import './CardGrid.css';

const CardGrid = ({ items }) => {
    const navigate = useNavigate();

    const handleCardClick = (id) => {
        navigate(`/show-details/${id}`);
    };

    return (
        <div className="card-grid">
            {items.map((item) => (
                <div key={item.id} onClick={() => handleCardClick(item.id)}>
                    <Card image={item.image} title={item.title} />
                </div>
            ))}
        </div>
    );
};

export default CardGrid;

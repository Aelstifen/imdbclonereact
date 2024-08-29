import React from 'react';
import Card from './Card';
import './CardGrid.css';

const CardGrid = ({ items }) => {
    return (
        <div className="card-grid">
            {items.map((item, index) => (
                <Card key={index} image={item.image} title={item.title} description={item.description} />
            ))}
        </div>
    );
};

export default CardGrid;

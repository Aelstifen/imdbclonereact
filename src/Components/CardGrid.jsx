import React from 'react';
import Card from './Card';
import './CardGrid.css';

const CardGrid = ({ items, renderOverlay, onCardClick }) => {
    return (
        <div className="card-grid">
            {items.map((item) => (
                <Card
                    key={item.id}
                    item={item}
                    renderOverlay={renderOverlay ? () => renderOverlay(item) : undefined}
                    onClick={() => onCardClick(item.id)}
                />
            ))}
        </div>
    );
};

export default CardGrid;
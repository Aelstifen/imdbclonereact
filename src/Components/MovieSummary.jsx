import React from 'react';
import './MovieSummary.css';

const MovieSummary = ({ summary }) => {
    return (
        <div className="summary-container">
            <p className="movie-summary">
                {summary}
            </p>
        </div>
    );
};

export default MovieSummary;

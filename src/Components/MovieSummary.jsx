import React, { useState } from 'react';
import './MovieSummary.css';

const MovieSummary = ({ summary, maxLength = 300 }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!summary || summary.trim() === '') {
        return null;
    }

    const shouldTruncate = summary.length > maxLength;
    const displayText = shouldTruncate && !isExpanded
        ? `${summary.substring(0, maxLength).trim()}...`
        : summary;

    return (
        <div className="summary-container">
            <p className="movie-summary" aria-label="Movie summary">
                {displayText}
                {shouldTruncate && (
                    <button
                        className="summary-toggle"
                        onClick={() => setIsExpanded(!isExpanded)}
                        aria-expanded={isExpanded}
                    >
                        {isExpanded ? ' Show less' : ' Show more'}
                    </button>
                )}
            </p>
        </div>
    );
};

export default MovieSummary;

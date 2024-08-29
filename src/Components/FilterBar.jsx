import React from 'react';
import './FilterBar.css';

const FilterBar = ({ onSearch, onFilterChange }) => {
    const years = Array.from({ length: 25 }, (_, i) => 2024 - i); // Generates years from 2024 to 2000

    return (
        <div className="filter-bar">
            <div className="filter-item">
                <label htmlFor="search">Search</label>
                <input
                    type="text"
                    id="search"
                    placeholder="Search..."
                    onChange={(e) => onSearch(e.target.value)}
                />
            </div>
            <div className="filter-item">
                <label htmlFor="genres">Genres</label>
                <select id="genres" onChange={(e) => onFilterChange('genres', e.target.value)}>
                    <option value="any">Any</option>
                    <option value="action">Action</option>
                    <option value="comedy">Comedy</option>
                    <option value="drama">Drama</option>
                    {/* Add more genres as needed */}
                </select>
            </div>
            <div className="filter-item">
                <label htmlFor="year">Year</label>
                <select id="year" onChange={(e) => onFilterChange('year', e.target.value)} size="1">
                    <option value="any">Any</option>
                    {years.map(year => (
                        <option key={year} value={year}>{year}</option>
                    ))}
                </select>
            </div>
            <div className="filter-item">
                <label htmlFor="format">Format</label>
                <select id="format" onChange={(e) => onFilterChange('format', e.target.value)}>
                    <option value="any">Any</option>
                    <option value="tv">TV</option>
                    <option value="movie">Movie</option>
                    {/* Add more formats as needed */}
                </select>
            </div>
            <div className="filter-item">
                <label htmlFor="status">Airing Status</label>
                <select id="status" onChange={(e) => onFilterChange('status', e.target.value)}>
                    <option value="any">Any</option>
                    <option value="airing">Airing</option>
                    <option value="completed">Completed</option>
                    <option value="upcoming">Upcoming</option>
                </select>
            </div>
        </div>
    );
};

export default FilterBar;

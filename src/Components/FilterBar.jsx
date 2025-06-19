import React from 'react';
import './FilterBar.css';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

const FilterBar = ({
                       onSearch,
                       onFilterChange,
                       availableGenres = [],
                       availableFormats = [],
                       yearRange = {},
                       filters = {},
                       clearFilter
                   }) => {

    const generateYearOptions = () => {
        const options = [];
        if (yearRange.min !== null && yearRange.max !== null) {
            for (let year = yearRange.max; year >= yearRange.min; year--) {
                options.push(year);
            }
        }
        return options;
    };

    const handleGenreChange = (e) => {
        const selected = e.target.value;
        let updatedGenres = [...filters.genres];
        if (!updatedGenres.includes(selected)) {
            updatedGenres.push(selected);
            onFilterChange('genres', updatedGenres);
        }
    };

    return (
        <>
            <div className="filter-bar">

                {/* Search (with icons now) */}
                <div className="filter-item">
                    <label htmlFor="search">Search</label>
                    <div className="select-with-icon-wrapper">
                        <input
                            type="text"
                            id="search"
                            placeholder="Search..."
                            value={filters.search}
                            onChange={(e) => onSearch(e.target.value)}
                            className="select-with-icon"
                        />
                        <div className="icon-overlay">
                            {filters.search ? (
                                <FaTimes className="select-icon" onClick={() => clearFilter('search')} />
                            ) : null}
                        </div>
                    </div>
                </div>

                {/* Genres */}
                <div className="filter-item">
                    <label htmlFor="genres">Genres</label>
                    <div className="select-with-icon-wrapper">
                        <select
                            id="genres"
                            onChange={handleGenreChange}
                            className="select-with-icon"
                            value={filters.genres.length > 0 ? filters.genres[0] : ""}
                        >
                            <option value="">Select Genre</option>
                            {availableGenres.map((g) => (
                                <option key={g} value={g}>
                                    {g.charAt(0).toUpperCase() + g.slice(1)}
                                </option>
                            ))}
                        </select>

                        <div className="icon-overlay">
                            {filters.genres.length > 0 ? (
                                <FaTimes className="select-icon" onClick={() => clearFilter('genres')} />
                            ) : (
                                <FaChevronDown className="select-icon" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Format */}
                <div className="filter-item">
                    <label htmlFor="format">Format</label>
                    <div className="select-with-icon-wrapper">
                        <select
                            id="format"
                            value={filters.format}
                            onChange={(e) => onFilterChange('format', e.target.value)}
                            className="select-with-icon"
                        >
                            <option value="any">Any</option>
                            {availableFormats.map((f) => (
                                <option key={f} value={f}>{f}</option>
                            ))}
                        </select>

                        <div className="icon-overlay">
                            {filters.format !== 'any' ? (
                                <FaTimes className="select-icon" onClick={() => clearFilter('format')} />
                            ) : (
                                <FaChevronDown className="select-icon" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Year */}
                <div className="filter-item">
                    <label htmlFor="year">Year</label>
                    <div className="select-with-icon-wrapper">
                        <select
                            id="year"
                            value={filters.year}
                            onChange={(e) => onFilterChange('year', e.target.value)}
                            className="select-with-icon"
                        >
                            <option value="any">Any</option>
                            {generateYearOptions().map((year) => (
                                <option key={year} value={year}>{year}</option>
                            ))}
                        </select>

                        <div className="icon-overlay">
                            {filters.year !== 'any' ? (
                                <FaTimes className="select-icon" onClick={() => clearFilter('year')} />
                            ) : (
                                <FaChevronDown className="select-icon" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Display selected genres */}
            {filters.genres.length > 0 && (
                <div className="selected-genres-row">
                    {filters.genres.map((g) => (
                        <span key={`${g}`} className="selected-genre">
                            {g}
                            <button
                                onClick={() => onFilterChange('genres', filters.genres.filter(x => x !== g))}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}
        </>
    );
};

export default FilterBar;

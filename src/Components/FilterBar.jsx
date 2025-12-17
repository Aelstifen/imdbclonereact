import React, { useMemo } from 'react';
import './FilterBar.css';
import { FaChevronDown, FaTimes } from 'react-icons/fa';

const FilterBar = ({
    onSearch,
    onFilterChange,
    availableGenres = [],
    availableFormats = [],
    yearRange = {},
    filters = { search: '', genres: [], format: 'any', year: 'any', sortBy: 'POPULARITY' },
    clearFilter
}) => {
    const yearOptions = useMemo(() => {
        const options = [];
        if (yearRange.min !== null && yearRange.max !== null) {
            for (let year = yearRange.max; year >= yearRange.min; year--) {
                options.push(year);
            }
        }
        return options;
    }, [yearRange.min, yearRange.max]);

    const sortOptions = [
        { value: 'POPULARITY', label: 'Popularity' },
        { value: 'TITLE', label: 'Title' },
        { value: 'START_YEAR', label: 'Start Year' },
        { value: 'RUNTIME', label: 'Runtime' },
        { value: 'LAST_CREATED', label: 'Recently Added' },
        { value: 'LAST_UPDATED', label: 'Recently Updated' }
    ];

    const handleGenreChange = (e) => {
        const selected = e.target.value;
        if (selected && !filters.genres.includes(selected)) {
            onFilterChange('genres', [...filters.genres, selected]);
        }
    };

    return (
        <>
            <div className="filter-bar">
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
                            {filters.search && (
                                <FaTimes className="select-icon" onClick={() => clearFilter('search')} />
                            )}
                        </div>
                    </div>
                </div>

                <div className="filter-item">
                    <label htmlFor="genres">Genres</label>
                    <div className="select-with-icon-wrapper">
                        <select
                            id="genres"
                            onChange={handleGenreChange}
                            className="select-with-icon"
                            value=""
                        >
                            <option value="" disabled>Select Genre</option>
                            {availableGenres.map((g) => (
                                !filters.genres.includes(g) && (
                                    <option key={g} value={g}>
                                        {g.charAt(0).toUpperCase() + g.slice(1)}
                                    </option>
                                )
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
                            {yearOptions.map((year) => (
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

                <div className="filter-item">
                    <label htmlFor="sortBy">Sort by</label>
                    <div className="select-with-icon-wrapper">
                        <select
                            id="sortBy"
                            value={filters.sortBy || 'POPULARITY'}
                            onChange={(e) => onFilterChange('sortBy', e.target.value)}
                            className="select-with-icon"
                        >
                            {sortOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>

                        <div className="icon-overlay">
                            {filters.sortBy && filters.sortBy !== 'POPULARITY' ? (
                                <FaTimes className="select-icon" onClick={() => clearFilter('sortBy')} />
                            ) : (
                                <FaChevronDown className="select-icon" />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {(filters.genres.length > 0 || filters.format !== 'any' || filters.year !== 'any' || (filters.sortBy && filters.sortBy !== 'POPULARITY')) && (
                <div className="selected-filters-row">
                    {filters.genres.map((g) => (
                        <span key={`genre-${g}`} className="selected-filter">
                            {g}
                            <button
                                onClick={() => onFilterChange('genres', filters.genres.filter(x => x !== g))}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    {filters.format !== 'any' && (
                        <span className="selected-filter">
                            Format: {filters.format}
                            <button onClick={() => clearFilter('format')}>
                                ×
                            </button>
                        </span>
                    )}
                    {filters.year !== 'any' && (
                        <span className="selected-filter">
                            Year: {filters.year}
                            <button onClick={() => clearFilter('year')}>
                                ×
                            </button>
                        </span>
                    )}
                    {(filters.sortBy && filters.sortBy !== 'POPULARITY') && (
                        <span className="selected-filter">
                            Sort: {sortOptions.find(s => s.value === filters.sortBy)?.label || filters.sortBy}
                            <button onClick={() => clearFilter('sortBy')}>
                                ×
                            </button>
                        </span>
                    )}
                </div>
            )}
        </>
    );
};

export default FilterBar;

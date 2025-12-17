import React, {useEffect, useState, useMemo, useReducer, useRef} from 'react';
import debounce from 'lodash.debounce';
import './AdminFilterBar.css';
import apiService from "./Services/apiServices.js";
import {useAdmin} from "./Hooks/useAdmin.js";

const initialFilterState = {
    search: '',
    genres: [],
    year: 'any',
    format: 'any',
    sortBy: 'popularity'
};

const filtersReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FILTER':
            if (state[action.key] === action.value) {
                return state;
            }
            return {...state, [action.key]: action.value};

        case 'SET_GENRES':
            return {...state, genres: action.payload};
        case 'CLEAR_FILTER':
            if (action.key === 'genres') return {...state, genres: []};
            if (action.key === 'sortBy') return {...state, sortBy: 'popularity'};
            return {...state, [action.key]: 'any'};
        case 'CLEAR_ALL':
            return {...initialFilterState, search: state.search};
        default:
            return state;
    }
};

const AdminFilterBar = ({ onFilterChange }) => {
    const { adminSearchTerm } = useAdmin();

    const [filters, dispatch] = useReducer(filtersReducer, initialFilterState);
    const [availableGenres, setAvailableGenres] = useState([]);
    const [availableFormats, setAvailableFormats] = useState([]);
    const [yearRange, setYearRange] = useState({min: null, max: null});
    const isInitialMount = useRef(true);

    useEffect(() => {
        const loadFilterOptions = async () => {
            try {
                const [genres, formats, years] = await Promise.all([
                    apiService.getGenres(),
                    apiService.getFormats(),
                    apiService.getYears(),
                ]);
                setAvailableGenres(genres);
                setAvailableFormats(formats);
                setYearRange(years);
            } catch (err) {
                console.error("Error fetching filter options:", err);
            }
        };
        loadFilterOptions();
    }, []);

    const debouncedOnFilterChange = useMemo(
        () => debounce((newFilters) => onFilterChange(newFilters), 500),
        [onFilterChange]
    );

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        debouncedOnFilterChange(filters);
    }, [filters, debouncedOnFilterChange]);

    useEffect(() => {
        dispatch({type: 'SET_FILTER', key: 'search', value: adminSearchTerm});
    }, [adminSearchTerm]);

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
        if (selected && !filters.genres.includes(selected)) {
            dispatch({type: 'SET_GENRES', payload: [...filters.genres, selected]});
        }
    };

    const availableSortOptions = [
        {value: 'popularity', label: 'Popularity'},
        {value: 'title', label: 'Title (A-Z)'},
        {value: 'startYear', label: 'Year (Newest)'},
        {value: 'runtime', label: 'Runtime'},
        {value: 'lastupdated', label: 'Last Updated'},
        {value: 'lastcreated', label: 'Date Created'},
    ];

    return (
        <div className="admin-filter-bar-container">
            <div className="admin-filter-grid">
                <div className="admin-filter-item">
                    <label>Genres</label>
                    <select onChange={handleGenreChange} value="">
                        <option value="">Select Genre</option>
                        {availableGenres.map(g => <option key={g} value={g}>{g}</option>)}
                    </select>
                </div>
                <div className="admin-filter-item">
                    <label>Format</label>
                    <select value={filters.format}
                            onChange={e => dispatch({type: 'SET_FILTER', key: 'format', value: e.target.value})}>
                        <option value="any">Any</option>
                        {availableFormats.map(f => <option key={f} value={f}>{f}</option>)}
                    </select>
                </div>
                <div className="admin-filter-item">
                    <label>Year</label>
                    <select value={filters.year}
                            onChange={e => dispatch({type: 'SET_FILTER', key: 'year', value: e.target.value})}>
                        <option value="any">Any</option>
                        {generateYearOptions().map(year => <option key={year} value={year}>{year}</option>)}
                    </select>
                </div>
                <div className="admin-filter-item">
                    <label>Sort By</label>
                    <select value={filters.sortBy}
                            onChange={e => dispatch({type: 'SET_FILTER', key: 'sortBy', value: e.target.value})}>
                        {availableSortOptions.map(opt => <option key={opt.value}
                                                                 value={opt.value}>{opt.label}</option>)}
                    </select>
                </div>
            </div>
            {(filters.genres.length > 0 || filters.year !== 'any' || filters.format !== 'any' || filters.sortBy !== 'popularity') && (
                <div className="admin-filter-tags">
                    {filters.genres.map(g => (
                        <span key={g} className="admin-filter-tag genre-tag">
                            {g}
                            <button onClick={() => dispatch({
                                type: 'SET_GENRES',
                                payload: filters.genres.filter(genre => genre !== g)
                            })}>&times;</button>
                        </span>
                    ))}
                    {filters.year !== 'any' && (
                        <span className="admin-filter-tag year-tag">
                            Year: {filters.year}
                            <button onClick={() => dispatch({type: 'CLEAR_FILTER', key: 'year'})}>&times;</button>
                        </span>
                    )}
                    {filters.format !== 'any' && (
                        <span className="admin-filter-tag format-tag">
                            Format: {filters.format}
                            <button onClick={() => dispatch({type: 'CLEAR_FILTER', key: 'format'})}>&times;</button>
                        </span>
                    )}
                    {filters.sortBy !== 'popularity' && (
                        <span className="admin-filter-tag sort-tag">
                            Sort: {availableSortOptions.find(o => o.value === filters.sortBy)?.label}
                            <button onClick={() => dispatch({type: 'CLEAR_FILTER', key: 'sortBy'})}>&times;</button>
                        </span>
                    )}

                    <button onClick={() => dispatch({type: 'CLEAR_ALL'})}>Clear All</button>
                </div>
            )}
        </div>
    );
};

export default AdminFilterBar;
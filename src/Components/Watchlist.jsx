import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import './Watchlist.css';
import { useAuth } from "./Hooks/useAuth.js";
import { Link } from 'react-router-dom';
import WatchlistButton from './WatchlistButton';
import apiService from './Services/apiServices.js';

const Watchlist = () => {
    const [selectedYear, setSelectedYear] = useState(null);
    const { isLoggedIn, email } = useAuth();
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [filters, setFilters] = useState({
        format: 'any',
        genres: [],
        year: 'any',
        status: 'any',
        country: 'any',
    });

    const { data: genres = [] } = useQuery({
        queryKey: ['genres'],
        queryFn: apiService.getGenres
    });
    const { data: formats = [] } = useQuery({
        queryKey: ['formats'],
        queryFn: apiService.getFormats
    });
    const { data: yearsData } = useQuery({
        queryKey: ['years'],
        queryFn: apiService.getYears
    });

    const { data: watchlist = [], isLoading: watchlistLoading } = useQuery({
        queryKey: ['watchlist', email],
        queryFn: apiService.getWatchlist,
        enabled: isLoggedIn && !!email,
    });

    const { data: detailsMap = {} } = useQuery({
        queryKey: ['watchlistDetails', watchlist],
        queryFn: async () => {
            const titleIds = [...new Set(watchlist.map((e) => e.titleId))];
            const detailsPromises = titleIds.map(async (tconst) => {
                const data = await apiService.getShowDetails(tconst);
                return [tconst, data];
            });
            return Object.fromEntries(await Promise.all(detailsPromises));
        },
        enabled: !!watchlist && watchlist.length > 0,
    });

    const grouped = useMemo(() => {
        if (!watchlist) return {};
        return watchlist.reduce((acc, entry) => {
            const cat = entry.category;
            if (!acc[cat]) acc[cat] = [];
            acc[cat].push(entry);
            return acc;
        }, {});
    }, [watchlist]);

    const yearRange = useMemo(() => ({
        start: yearsData?.min || 1910,
        end: yearsData?.max || 2025,
    }), [yearsData]);

    const displayedCategories = selectedCategory === 'All'
        ? ['Watching', 'Completed', 'Planning', 'Dropped', 'Paused']
        : [selectedCategory];

    const formatTitleType = (rawType) => {
        switch (rawType) {
            case 'movie': return 'Movie';
            case 'short': return 'Short Film';
            case 'tvSeries': return 'TV Series';
            case 'tvShort': return 'TV Short';
            default: return rawType ? rawType.charAt(0).toUpperCase() + rawType.slice(1) : '';
        }
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const clearYearFilter = () => {
        setSelectedYear(null);
        handleFilterChange('year', 'any');
    };

    const clearGenreFilter = (genreToRemove) => {
        setFilters((prev) => ({
            ...prev,
            genres: prev.genres.filter((g) => g !== genreToRemove),
        }));
    };

    const matchesFilters = (details) => {
        if (!details) return false;
        const formatMatch = filters.format === 'any' || details.titleType === filters.format;
        const genreMatch = filters.genres.length === 0 || filters.genres.every((g) => details.genres?.includes(g));
        const yearMatch = filters.year === 'any' || parseInt(details.startYear) === parseInt(filters.year);
        const countryMatch = filters.country === 'any' || details.country === filters.country;
        return formatMatch && genreMatch && yearMatch && countryMatch;
    };

    if (watchlistLoading) {
        return <div className="watchlist-loading">Loading watchlist...</div>;
    }

    const userEmail = email || 'User';

    return (
        <div>
            <div className="profile-header">
                <div className="profile-avatar-placeholder">
                    {userEmail.charAt(0).toUpperCase()}
                </div>
                <div className="profile-username">{userEmail}</div>
            </div>

            <div className="profile-nav-placeholder"></div>

            <div className="layout">
                <div className="sidebar">
                    <input type="text" placeholder="Filter" />
                    <div className="filters">
                        <h2>Lists</h2>
                        {['All', 'Watching', 'Completed', 'Dropped', 'Planning', 'Paused'].map((cat) => (
                            <button
                                key={cat}
                                className={`filters-button ${selectedCategory === cat ? 'stylish-selected' : ''}`}
                                onClick={() => setSelectedCategory(cat)}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                    <div className="filters">
                        <h2>Filters</h2>
                        <select onChange={(e) => handleFilterChange('format', e.target.value)} value={filters.format}>
                            <option value="any">Format</option>
                            {formats.map((format) => (
                                <option key={format} value={format}>{formatTitleType(format)}</option>
                            ))}
                        </select>
                        <select onChange={(e) => handleFilterChange('status', e.target.value)} value={filters.status}>
                            <option value="any">Status</option>
                            <option value="airing">Airing</option>
                            <option value="completed">Completed</option>
                        </select>
                        <select
                            onChange={(e) => {
                                const value = e.target.value;
                                if (value !== 'any' && !filters.genres.includes(value)) {
                                    handleFilterChange('genres', [...filters.genres, value]);
                                }
                            }}
                            value={filters.genres.length > 0 ? filters.genres.slice(-1)[0] : 'any'}
                        >
                            <option value="any">Genres</option>
                            {genres.map((genre) => (
                                <option key={genre} value={genre}>{genre}</option>
                            ))}
                        </select>
                        <div className="selected-genres">
                            {filters.genres.map((genre) => (
                                <div key={genre} className="selected-year-chip">
                                    {genre} <span className="clear-chip" onClick={() => clearGenreFilter(genre)}>×</span>
                                </div>
                            ))}
                        </div>
                        <select onChange={(e) => handleFilterChange('country', e.target.value)} value={filters.country}>
                            <option value="any">Country</option>
                            <option value="Japan">Japan</option>
                            <option value="USA">USA</option>
                        </select>
                        <label htmlFor="year-range">Year</label>
                        <div className="range-wrapper">
                            <div className="slider-container">
                                <input
                                    type="range"
                                    id="year-range"
                                    name="year-range"
                                    min={yearRange.start}
                                    max={yearRange.end}
                                    value={selectedYear ?? yearRange.start}
                                    onChange={(e) => {
                                        const val = parseInt(e.target.value);
                                        setSelectedYear(val);
                                        handleFilterChange('year', val);
                                    }}
                                />
                                {selectedYear && (
                                    <div className="selected-year-chip">
                                        {selectedYear} <span className="clear-chip" onClick={clearYearFilter}>×</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <select>
                            <option hidden>Sort</option>
                            <option>Progress</option>
                            <option>Score</option>
                        </select>
                    </div>
                </div>
                <div className="main">
                    {displayedCategories.map((category) => {
                        const filteredEntries = (grouped[category] || []).filter(entry => matchesFilters(detailsMap[entry.titleId]));
                        if (filteredEntries.length === 0) return null;

                        return (
                            <div key={category}>
                                <h2>{category}</h2>
                                <div className="table-container">
                                    <table>
                                        <thead>
                                        <tr>
                                            <th>Title</th>
                                            <th>Score</th>
                                            <th>Progress</th>
                                            <th>Type</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredEntries.map((entry) => {
                                            const details = detailsMap[entry.titleId];
                                            if (!details) return null;
                                            return (
                                                <tr key={entry.titleId}>
                                                    <td className="title-cell">
                                                        <img
                                                            src={details.imageLink}
                                                            alt={details.primaryTitle}
                                                            onError={(e) => {
                                                                e.target.onerror = null;
                                                                e.target.src = `https://placehold.co/40x50/1f2937/ffffff?text=${encodeURIComponent(details.primaryTitle.charAt(0))}`;
                                                            }}
                                                        />
                                                        <div className="title-with-watchlist">
                                                            <Link to={`/title/${entry.titleId}`} className="watchlist-title-link">
                                                                {details.primaryTitle}
                                                            </Link>
                                                            <WatchlistButton
                                                                showButton={true}
                                                                titleId={entry.titleId}
                                                                onSelect={() => {}}
                                                            />
                                                        </div>
                                                    </td>
                                                    <td>–</td>
                                                    <td>–</td>
                                                    <td>{formatTitleType(details.titleType)}</td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Watchlist;
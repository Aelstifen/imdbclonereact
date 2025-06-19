import React, { useState, useEffect, useCallback } from 'react';
import FilterBar from './FilterBar';
import CardGrid from './CardGrid';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import qs from 'qs';
import debounce from 'lodash.debounce';

const SamplePage = () => {
    const [filters, setFilters] = useState({
        search: '',
        genres: [],
        year: 'any',
        season: 'any',
        format: 'any',
        status: 'any',
    });

    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [genres, setGenres] = useState([]);
    const [formats, setFormats] = useState([]);
    const [yearRange, setYearRange] = useState({});
    const navigate = useNavigate();

    // Load initial filter options (only once)
    useEffect(() => {
        const loadFilters = async () => {
            try {
                const [genresRes, formatsRes, yearsRes] = await Promise.all([
                    axios.get('/api/filters/genres'),
                    axios.get('/api/filters/formats'),
                    axios.get('/api/filters/years'),
                ]);
                setGenres(genresRes.data);
                setFormats(formatsRes.data);
                setYearRange(yearsRes.data);
            } catch (err) {
                console.error("Error fetching filters:", err);
            }
        };
        loadFilters().catch(console.error);
    }, []);

    // Debounce function (stable reference)
    const debounceFilters = useCallback(
        debounce((newFilters) => {
            setDebouncedFilters(newFilters);
            setPage(0);
            setItems([]);
            setHasMore(true);
        }, 500),
        []
    );

    // Handle filter changes
    const handleFilterChange = (key, value) => {
        const updatedFilters = { ...filters, [key]: value };
        setFilters(updatedFilters);
        setLoading(true);
        debounceFilters(updatedFilters);
    };

    const handleSearch = (searchTerm) => {
        handleFilterChange('search', searchTerm);
    };

    const clearFilter = (key) => {
        const updatedFilters = { ...filters };
        if (key === 'genres') updatedFilters.genres = [];
        else if (key === 'search') updatedFilters.search = '';
        else updatedFilters[key] = 'any';
        setFilters(updatedFilters);
        setLoading(true);
        debounceFilters(updatedFilters);
    };

    // Infinite scroll listener
    useEffect(() => {
        const handleScroll = () => {
            if (
                window.innerHeight + document.documentElement.scrollTop >=
                document.documentElement.offsetHeight - 200 &&
                !loading &&
                hasMore
            ) {
                setPage((prevPage) => prevPage + 1);
            }
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [loading, hasMore]);

    // Fetch cards whenever debounced filters or page changes
    useEffect(() => {
        let cancelled = false;

        const fetchCards = async () => {
            try {
                setLoading(true);
                const response = await axios.get('/api/filters/cards', {
                    params: {
                        page,
                        size: 20,
                        search: debouncedFilters.search || null,
                        year: debouncedFilters.year !== 'any' ? debouncedFilters.year : null,
                        format: debouncedFilters.format !== 'any' ? debouncedFilters.format : null,
                        ...(debouncedFilters.genres.length > 0 ? { genres: debouncedFilters.genres } : {})
                    },
                    paramsSerializer: params => qs.stringify(params, { arrayFormat: 'repeat' })
                });

                const newItemsRaw = response.data.content || response.data;

                const newItems = newItemsRaw.map((item) => ({
                    id: item.id,
                    title: item.title,
                    image: item.image || 'https://via.placeholder.com/200x300?text=No+Image'
                }));

                if (!cancelled) {
                    if (page === 0) {
                        setItems(newItems);
                    } else {
                        setItems((prevItems) => [...prevItems, ...newItems]);
                    }
                    if (newItems.length === 0) {
                        setHasMore(false);
                    }
                }
            } catch (err) {
                console.error('Error loading cards:', err);
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };


        fetchCards().catch(console.error);
        return () => { cancelled = true; };
    }, [debouncedFilters, page]);

    const handleCardClick = (tconst) => {
        console.log("Clicked tconst: ", tconst);
        navigate(`/show-details/${tconst}`);
    };

    return (
        <div>
            <FilterBar
                onSearch={handleSearch}
                onFilterChange={handleFilterChange}
                availableGenres={genres}
                availableFormats={formats}
                yearRange={yearRange}
                filters={filters}
                clearFilter={clearFilter}
            />
            <CardGrid items={items} onCardClick={handleCardClick} />
            {loading && <p style={{ textAlign: 'center' }}>Loading...</p>}
        </div>
    );
};

export default SamplePage;

import React, {useState, useEffect, useReducer, useMemo, useCallback, useRef} from 'react';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import FilterBar from './FilterBar';
import CardGrid from './CardGrid';
import { useLocation, useNavigate } from 'react-router-dom';
import debounce from 'lodash.debounce';
import WatchlistButton from './WatchlistButton';
import './SamplePage.css';
import CardSkeleton from "./CardSkeleton.jsx";
import apiService from "./Services/apiServices.js";

const initialFilterState = {
    search: '',
    genres: [],
    year: 'any',
    format: 'any',
    sortBy: 'POPULARITY',
};

const filterReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FILTER':
            return { ...state, [action.key]: action.value };
        case 'CLEAR_FILTER':
            if (action.key === 'genres') return { ...state, genres: [] };
            if (action.key === 'search') return { ...state, search: '' };
            if (action.key === 'sortBy') return { ...state, sortBy: 'POPULARITY' };
            return { ...state, [action.key]: 'any' };
        default:
            return state;
    }
};

const SampleBrowsePage = () => {
    const location = useLocation();
    const initialSearch = location.state?.search || '';
    const [filters, dispatch] = useReducer(filterReducer, {...initialFilterState, search: initialSearch});
    const [debouncedFilters, setDebouncedFilters] = useState(filters);
    const navigate = useNavigate();
    const observerTarget = useRef(null);

    /*useEffect(() => {
        if (location.state?.search !== undefined && location.state?.search !== filters.search) {
            dispatch({ type: 'SET_FILTER', key: 'search', value: location.state.search });
        }
    }, [location.state?.search, filters.search])*/;

    const debounceFilters = useMemo(
        () => debounce(setDebouncedFilters, 500),
        []
    );

    useEffect(() => {
        debounceFilters(filters);
        return () => {
            debounceFilters.cancel();
        };
    }, [filters, debounceFilters]);

    const { data: genres = [] } = useQuery({
        queryKey: ['genres'],
        queryFn: apiService.getGenres
    });
    const { data: formats = [] } = useQuery({
        queryKey: ['formats'],
        queryFn: apiService.getFormats
    });
    const { data: yearRangeData } = useQuery({
        queryKey: ['years'],
        queryFn: apiService.getYears
    });
    const yearRange = useMemo(() => yearRangeData || { min: 1980, max: 2025 }, [yearRangeData]);

    const {
        data,
        error,
        isLoading,
        hasNextPage,
        fetchNextPage,
        isFetchingNextPage
    } = useInfiniteQuery({
        queryKey: ['cards', debouncedFilters],
        queryFn: ({ pageParam = 0 }) => apiService.getCards(debouncedFilters, pageParam),
        getNextPageParam: (lastPage, allPages) => {
            const pageSize = 20;

            if (!lastPage || lastPage.length === 0) {
                return undefined;
            }

            if (lastPage.length < pageSize) {
                return undefined;
            }

            return allPages.length;
        },
    });

    const items = useMemo(() => {
        if (!data) return [];
        return data.pages.flatMap(page =>
            (page || []).map(item => ({
                id: item.id,
                title: item.title,
                image: item.image || 'https://placehold.co/200x300?text=No+Image',
            }))
        );
    }, [data]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1 }
        );

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

    const handleFilterChange = (key, value) => {
        dispatch({ type: 'SET_FILTER', key, value });
    };

    const handleSearch = (searchTerm) => {
        dispatch({ type: 'SET_FILTER', key: 'search', value: searchTerm });
    };

    const clearFilter = (key) => {
        dispatch({ type: 'CLEAR_FILTER', key });
    };

    const handleCardClick = useCallback(async (tconst) => {
        try {
            await apiService.logTitleClick(tconst);
        } catch (error) {
            console.error(`Error logging click for ${tconst}:`, error);
        }
        navigate(`/title/${tconst}`);
    }, [navigate]);

    const renderSkeletons = useCallback(() => {
        const skeletonCount = items.length === 0 ? 20 : 8;
        return Array.from({ length: skeletonCount }).map((_, index) => (
            <CardSkeleton key={index} />
        ));
    }, [items.length]);

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
            {error && <p className="error-message">{error.message}</p>}

            <CardGrid
                items={items}
                onCardClick={handleCardClick}
                renderOverlay={(item) => (
                    <WatchlistButton
                        onSelect={() => {}}
                        titleId={item.id}
                    />
                )}
            />

            {(isLoading || isFetchingNextPage) && (
                <div className="card-grid-container">
                    {renderSkeletons()}
                </div>
            )}

            <div ref={observerTarget} style={{ height: '20px', margin: '10px' }} />

            {!hasNextPage && !isLoading && !isFetchingNextPage && items.length > 0 && (
                <p className="end-message">You've reached the end!</p>
            )}

            {!isLoading && !error && items.length === 0 && (
                <p className="empty-message">No items found with current filters.</p>
            )}
        </div>
    );
};

export default SampleBrowsePage;

import { useState, useEffect } from 'react';
import apiService from "../Services/apiServices.js";

const useInfiniteScrollQuery = (debouncedFilters) => {
    const [items, setItems] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setItems([]);
        setPage(0);
        setHasMore(true);
    }, [debouncedFilters]);

    useEffect(() => {
        let isCancelled = false;

        const fetchItems = async () => {
            if (!hasMore) {
                setLoading(false);
                return;
            }

            setLoading(true);
            setError(null);
            try {
                const data = await apiService.getCards(debouncedFilters, page);

                if (!isCancelled) {
                    const newItemsRaw = data;

                    if (!Array.isArray(newItemsRaw)) {
                        throw new Error('Data format error: Received non-array data.');
                    }

                    const newItems = newItemsRaw.map((item) => ({
                        id: item.id,
                        title: item.title,
                        image: item.image || 'https://placehold.co/200x300?text=No+Image',
                    }));

                    setItems((prev) => (page === 0 ? newItems : [...prev, ...newItems]));

                    const pageSize = 20;
                    setHasMore(newItems.length === pageSize);
                }
            } catch (err) {
                if (!isCancelled) {
                    console.error('Error in useInfiniteScrollQuery:', err);
                    setError('Failed to load content. Please try again.');
                }
            } finally {
                if (!isCancelled) {
                    setLoading(false);
                }
            }
        };

        fetchItems();

        return () => {
            isCancelled = true;
        };
    }, [debouncedFilters, page, hasMore]);

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

    return { items, loading, error, hasMore };
};

export default useInfiniteScrollQuery;
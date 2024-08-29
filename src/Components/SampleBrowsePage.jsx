import React, { useState } from 'react';
import FilterBar from './FilterBar';
import CardGrid from './CardGrid'; // Assume you have this component as well

const SamplePage = () => {
    const [filters, setFilters] = useState({
        search: '',
        genres: 'any',
        year: 'any',
        season: 'any',
        format: 'any',
        status: 'any',
    });

    const handleSearch = (searchTerm) => {
        setFilters((prev) => ({ ...prev, search: searchTerm }));
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const items = [
        { image: 'https://via.placeholder.com/200x300', title: 'TV Show 1', description: 'Description for TV Show 1' },
        { image: 'https://via.placeholder.com/200x300', title: 'TV Show 2', description: 'Description for TV Show 2' },
        { image: 'https://via.placeholder.com/200x300', title: 'TV Show 3', description: 'Description for TV Show 3' },
        { image: 'https://via.placeholder.com/200x300', title: 'TV Show 4', description: 'Description for TV Show 4' },
        { image: 'https://via.placeholder.com/200x300', title: 'TV Show 5', description: 'Description for TV Show 5' },
        { image: 'https://via.placeholder.com/200x300', title: 'TV Show 6', description: 'Description for TV Show 6' },
        { image: 'https://via.placeholder.com/200x300', title: 'TV Show 7', description: 'Description for TV Show 7' },
        { image: 'https://via.placeholder.com/200x300', title: 'TV Show 8', description: 'Description for TV Show 8' },
        { image: 'https://via.placeholder.com/200x300', title: 'TV Show 9', description: 'Description for TV Show 9' },
        { image: 'https://via.placeholder.com/200x300', title: 'TV Show 10', description: 'Description for TV Show 10' },
        { image: 'https://via.placeholder.com/200x300', title: 'TV Show 11', description: 'Description for TV Show 11' },
        { image: 'https://via.placeholder.com/200x300', title: 'TV Show 12', description: 'Description for TV Show 12' },
    ];

    return (
        <div>
            <FilterBar onSearch={handleSearch} onFilterChange={handleFilterChange} />
            <CardGrid items={items} />
        </div>
    );
};

export default SamplePage;

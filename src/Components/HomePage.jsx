import React from 'react';
import Slider from './Slider.jsx';
import MovieSummary from './MovieSummary.jsx';
import TitleCarousel from './TitleCarousel.jsx';
import apiService from "./Services/apiServices.js";
import './HomePage.css';

const HomePage = () => {
    return (
        <div className="home-page-content">
            <Slider />

            <MovieSummary summary="This is a sample movie summary. The movie tells the tale of an epic journey through unknown lands, filled with adventure, mystery, and excitement." />

            <TitleCarousel
                title="Trending Titles"
                queryKey="trendingTitles"
                fetchData={apiService.getTrendingTitles}
            />

            <TitleCarousel
                title="Recently Added"
                queryKey="recentlyAddedTitles"
                fetchData={apiService.getRecentlyAddedTitles}
            />
        </div>
    );
};

export default HomePage;

import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiService from "./Services/apiServices.js";
import './Slider.css';

const Slider = () => {
    const [currentItem, setCurrentItem] = useState(null);

    const {
        data: sliderItems,
        isLoading,
        error
    } = useQuery({
        queryKey: ['sliderContent'],
        queryFn: apiService.getSliderContent,
        refetchOnWindowFocus: false,
    });

    useEffect(() => {
        if (sliderItems && sliderItems.length > 0) {
            const randomIndex = Math.floor(Math.random() * sliderItems.length);
            setCurrentItem(sliderItems[randomIndex]);
        }
    }, [sliderItems]);

    const selectNewRandomItem = () => {
        if (!sliderItems || sliderItems.length <= 1 || !currentItem) return;

        let newIndex;
        const currentIndex = sliderItems.findIndex(item => item.id === currentItem.id);

        do {
            newIndex = Math.floor(Math.random() * sliderItems.length);
        } while (newIndex === currentIndex && sliderItems.length > 1);

        setCurrentItem(sliderItems[newIndex]);
    };

    if (isLoading) return <div className="slider-loading">Loading...</div>;
    if (error) return <div className="slider-error">Error: {error.message}</div>;
    if (!currentItem) return <div className="slider-empty">No items to display.</div>;
    return (
        <div className="slider">
            <div className="slider-arrow left-arrow" onClick={selectNewRandomItem}>
                <span>&lt;</span>
            </div>
            <div className="slider-content">
                <img
                    src={currentItem.imageUrl}
                    alt={currentItem.title}
                    className="slider-image"
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/1920x1080/1f2937/ffffff?text=No+Image';
                    }}
                />
                <div className="overlay">
                    <img
                        src={currentItem.thumbnailUrl}
                        alt="Thumbnail"
                        className="thumbnail"
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/300x200/1f2937/ffffff?text=No+Thumbnail';
                        }}
                    />
                    <div className="play-button">
                        <span>&#9654;</span>
                    </div>
                    <div className="slider-title">
                        <h3>{currentItem.title}</h3>
                        <span className="slider-duration">{currentItem.duration}</span>
                    </div>
                </div>
            </div>
            <div className="slider-arrow right-arrow" onClick={selectNewRandomItem}>
                <span>&gt;</span>
            </div>
        </div>
    );
};

export default Slider;
import React, { useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import apiService from './Services/apiServices.js';

const TitleCarousel = ({ title, queryKey, fetchData }) => {
    const navigate = useNavigate();
    const { data: titles, isLoading, error } = useQuery({
        queryKey: [queryKey],
        queryFn: fetchData,
        refetchOnWindowFocus: false,
    });

    const handleCardClick = useCallback(async (tconst) => {
        try {
            await apiService.logTitleClick(tconst);
        } catch (error) {
            console.error(`Error logging click for ${tconst}:`, error);
        }
        navigate(`/title/${tconst}`);
    }, [navigate]);

    if (isLoading) {
        return (
            <section className="content-section">
                <h2>{title}</h2>
                <div className="carousel-container-loading">
                    {[...Array(8)].map((_, index) => (
                        <div className="carousel-item-placeholder" key={index}>
                            <div className="carousel-item-placeholder-img"></div>
                            <div className="carousel-item-placeholder-title"></div>
                        </div>
                    ))}
                </div>
            </section>
        );
    }

    if (error) {
        return (
            <section className="content-section">
                <h2>{title}</h2>
                <div className="carousel-error">Could not load items.</div>
            </section>
        );
    }

    if (!titles || titles.length === 0) {
        return (
            <section className="content-section">
                <h2>{title}</h2>
                <div className="carousel-empty">No items to display.</div>
            </section>
        );
    }

    return (
        <section className="content-section">
            <h2>{title}</h2>
            <div className="carousel-container">
                {titles.map(movie => (
                    <div
                        className="carousel-item"
                        key={movie.id}
                        onClick={() => handleCardClick(movie.id)}
                    >
                        <img
                            src={movie.imageUrl}
                            alt={movie.title}
                            onError={(e) => {
                                e.target.onerror = null;
                                e.target.src = "https://placehold.co/150x220/666/333?text=No+Image";
                            }}
                        />
                        <div className="carousel-item-title">{movie.title}</div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default TitleCarousel;

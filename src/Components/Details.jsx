import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import WatchlistButton from './WatchlistButton';
import './Details.css';
import apiService from './Services/apiServices.js';

const Details = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const d = await apiService.getShowDetails(id);
                setData(d);
            } catch (err) {
                console.error('Error loading details:', err);
            } finally {
                setLoading(false);
            }
        };

        void fetchDetails();
    }, [id]);

    if (loading) return <div className="movie-detail-page">Loading...</div>;
    if (!data) return <div className="movie-detail-page">No data found.</div>;

    const getDisplayType = (type) => {
        switch (type) {
            case 'movie': return 'Movie';
            case 'tvSeries': return 'TV Show';
            case 'short': return 'Short';
            case 'tvShort': return 'TV Short';
            case 'tvMovie': return 'TV Movie';
            case 'tvMiniSeries': return 'TV Mini-Series';
            case 'tvSpecial': return 'TV Special';
            case 'video': return 'Video';
            default: return 'Unknown';
        }
    };

    return (
        <div className="movie-detail-page">
            <section className="movie-header">
                <div className="movie-poster">
                    <img
                        src={data.imageLink || 'https://placehold.co/200x300/1f2937/ffffff?text=No+Poster'}
                        alt={`${data.primaryTitle} Poster`}
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://placehold.co/200x300/1f2937/ffffff?text=No+Poster';
                        }}
                    />
                    <div className="add-to-watchlist-button">
                        <WatchlistButton
                            titleId={id}
                            onSelect={(category) => {}}
                        />
                    </div>
                </div>
                <div className="movie-info">
                    <h1>{data.primaryTitle}</h1>
                    {data.plot && <p className="summary">{data.plot}</p>}
                </div>
            </section>

            <section className="movie-body">
                <aside className="movie-stats">
                    <p><strong>Type:</strong> {getDisplayType(data.titleType)}</p>
                    <p><strong>Release Year:</strong> {data.startYear ?? 'N/A'}</p>
                    <p><strong>Total Number Of Episodes:</strong> {data.numEpisodes ?? 'N/A'}</p>
                    <p><strong>Total Number Of Seasons:</strong> {data.numSeasons ?? 'N/A'}</p>
                    <p><strong>Genre:</strong> {data.genres ?? 'N/A'}</p>
                    <p><strong>Runtime:</strong> {data.runtimeMinutes ? `${data.runtimeMinutes} min` : 'N/A'}</p>
                </aside>

                <main className="actor-grid">
                    {(!data.actors || data.actors.length === 0) && (
                        <p style={{ textAlign: 'center' }}>No actors found.</p>
                    )}
                    {data.actors?.map((actor) => (
                        <div className="actor-card" key={actor.nconst}>
                            <div className="actor-name">{actor.primaryName}</div>
                            <img
                                src={actor.imageLink || `https://placehold.co/60x60/1f2937/ffffff?text=${encodeURIComponent(actor.primaryName.charAt(0))}`}
                                alt={actor.primaryName}
                                className="actor-image"
                                onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://placehold.co/60x60/1f2937/ffffff?text=${encodeURIComponent(actor.primaryName.charAt(0))}`;
                                }}
                            />
                        </div>
                    ))}
                </main>
            </section>
        </div>
    );
};

export default Details;

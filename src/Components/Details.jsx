import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import './Details.css';

const Details = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetails = async () => {
            try {
                const response = await axios.get(`/api/show-details/${id}`);
                setData(response.data);
            } catch (err) {
                console.error("Error loading details:", err);
            } finally {
                setLoading(false);
            }
        };

        void fetchDetails();
    }, [id]);

    if (loading) {
        return <div className="movie-detail-page">Loading...</div>;
    }

    if (!data) {
        return <div className="movie-detail-page">No data found.</div>;
    }

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
                    <img src="https://picsum.photos/150/220" alt="Movie Poster" />
                </div>
                <div className="movie-info">
                    <h1>{data.primaryTitle}</h1>
                    <p className="summary">
                        This is the summary of the movie or TV show.
                    </p>
                </div>
            </section>

            <section className="movie-body">
                <aside className="movie-stats">
                    <p><strong>Type:</strong> {getDisplayType(data.titleType)}</p>
                    <p><strong>Total Number Of Episodes:</strong> {data.numEpisodes ?? 'N/A'}</p>
                    <p><strong>Total Number Of Seasons:</strong> {data.numSeasons ?? 'N/A'}</p>
                    <p><strong>Genre:</strong> {data.genres ?? 'N/A'}</p>
                    <p><strong>Runtime:</strong> {data.runtimeMinutes ? `${data.runtimeMinutes} min` : 'N/A'}</p>
                </aside>

                <main className="actor-grid">
                    {data.actors.length === 0 && (
                        <p style={{ textAlign: 'center' }}>No actors found.</p>
                    )}

                    {data.actors.map((actor, i) => (
                        <div className="actor-card" key={actor.nconst}>
                            <div className="actor-name">{actor.primaryName}</div>
                            <img src={`https://picsum.photos/60?random=${i + 1}`} alt={`Actor ${i + 1}`} className="actor-image" />
                        </div>
                    ))}
                </main>
            </section>
        </div>
    );
};

export default Details;

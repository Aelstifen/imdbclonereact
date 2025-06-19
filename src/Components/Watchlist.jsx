import React, { useEffect, useState } from 'react';
import './Watchlist.css';

const Watchlist = () => {
    const [year, setYear] = useState(2000);

    useEffect(() => {
        const slider = document.getElementById('year-range');
        const tooltip = document.getElementById('year-tooltip');

        const updateTooltip = () => {
            const min = parseInt(slider.min);
            const max = parseInt(slider.max);
            const val = parseInt(slider.value);
            const percent = (val - min) / (max - min);
            const thumbOffset = slider.offsetWidth * percent;
            tooltip.textContent = val;
            tooltip.style.left = `${thumbOffset}px`;
        };

        slider.addEventListener('input', updateTooltip);
        slider.addEventListener('mousemove', updateTooltip);
        updateTooltip();
    }, []);

    return (
        <div>
            <div className="profile-header">
                <img className="profile-avatar" src="https://picsum.photos/80" alt="Profile" />
                <div className="profile-username">ysfaltasha</div>
            </div>

            <div className="profile-nav-placeholder"></div>

            <div className="layout">
                <div className="sidebar">
                    <input type="text" placeholder="🔍 Filter" />

                    <div className="filters">
                        <h2>Lists</h2>
                        <button>All</button>
                        <button>Watching</button>
                        <button>Completed</button>
                        <button>Dropped</button>
                        <button>Planning</button>
                    </div>

                    <div className="filters">
                        <h2>Filters</h2>

                        <select><option hidden selected>Format</option><option>TV</option><option>Movie</option></select>
                        <select><option hidden selected>Status</option><option>Airing</option><option>Completed</option></select>
                        <select><option hidden selected>Genres</option><option>Action</option><option>Comedy</option></select>
                        <select><option hidden selected>Country</option><option>Japan</option><option>USA</option></select>

                        <label htmlFor="year-range">Year</label>
                        <div className="range-wrapper">
                            <div className="slider-container">
                                <input
                                    type="range"
                                    id="year-range"
                                    name="year-range"
                                    min="1980"
                                    max="2025"
                                    defaultValue="2000"
                                />
                                <div className="range-tooltip" id="year-tooltip">2000</div>
                            </div>
                        </div>

                        <select><option hidden selected>Sort</option><option>Progress</option><option>Score</option></select>
                    </div>
                </div>

                <div className="main">
                    <h2>Watching</h2>
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
                            <tr>
                                <td className="title-cell"><img src="https://picsum.photos/75/50" alt="Blue Box" />Blue Box</td>
                                <td>8</td>
                                <td>8/25</td>
                                <td>ONA</td>
                            </tr>
                            <tr>
                                <td className="title-cell"><img src="https://picsum.photos/75/50" alt="Boruto" />Boruto</td>
                                <td>7</td>
                                <td>105/293</td>
                                <td>TV</td>
                            </tr>
                            <tr>
                                <td className="title-cell"><img src="https://picsum.photos/75/50" alt="KamiKatsu" />KamiKatsu</td>
                                <td>–</td>
                                <td>0/12</td>
                                <td>TV</td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Watchlist;

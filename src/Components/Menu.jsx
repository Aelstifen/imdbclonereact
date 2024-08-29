import React from 'react';
import { Link } from 'react-router-dom';
import './Menu.css';

const Menu = ({ onClose }) => {
    return (
        <nav>
            <div className="menucontainer">
                <div className="close-button-container">
                    <button className="close-button" onClick={onClose}>
                        <span>X</span>
                    </button>
                </div>
                <div className="listcontainer">
                    <ul>
                        <li className="section-title">Movies</li>
                        <li><Link to="/top-movies" onClick={onClose}>Top Movies</Link></li>
                        <li><Link to="/trending-movies" onClick={onClose}>Trending Movies</Link></li>
                    </ul>
                    <ul>
                        <li className="section-title">TV Shows</li>
                        <li><Link to="/top-tv-shows" onClick={onClose}>Top TV Shows</Link></li>
                        <li><Link to="/trending-tv-shows" onClick={onClose}>Trending TV Shows</Link></li>
                    </ul>
                    <ul>
                        <li className="section-title">Celebs</li>
                        <li><Link to="https://www.google.com" onClick={onClose}>Popular Celebs</Link></li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Menu;

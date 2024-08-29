import React from 'react';
<<<<<<< HEAD
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
=======
import './Menu.css'; // Assuming you have a CSS file for styling

const Menu = () => {
    return (
        <nav>
            <ul>
                <li>
                    <img src="movies-icon.png" alt="Movies"/>
                    <span>Movies</span>
                    <ul className="sub-menu">
                        <li><a href="#">Release Calendar</a></li>
                        <li><a href="#">Top 250 Movies</a></li>
                        <li><a href="#">Most Popular Movies</a></li>
                        <li><a href="#">Browse Movies by Genre</a></li>
                        <li><a href="#">Top Box Office</a></li>
                        <li><a href="#">Showtimes & Tickets</a></li>
                        <li><a href="#">Movie News</a></li>
                        <li><a href="#">India Movie Spotlight</a></li>
                    </ul>
                </li>
                {/* Add the rest of your menu items here */}
            </ul>
>>>>>>> b4d5f92cc3402d27f460fd693cea28090e3f1610
        </nav>
    );
};

<<<<<<< HEAD
export default Menu;
=======
export default Menu;
>>>>>>> b4d5f92cc3402d27f460fd693cea28090e3f1610

import React from 'react';
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
        </nav>
    );
};

export default Menu;
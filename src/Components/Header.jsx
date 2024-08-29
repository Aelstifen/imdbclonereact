<<<<<<< HEAD
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Header.css';

const Header = ({ toggleMenu }) => {
    const navigate = useNavigate();

    return (
        <header>
            <div className="container">
                <div className="menu-container">
                    <button className="menu-toggle" onClick={toggleMenu}>
                        <span className="menu-icon">☰</span> Menu
                    </button>
                </div>
                <div className="home-icon-container">
                    <button className="home-button" onClick={() => navigate('/')}>
                        🏠
                    </button>
                </div>
                <div className="search-bar">
                    <select className="search-category">
                        <option value="all">All</option>
                    </select>
                    <input type="text" placeholder="Search..." />
                    <button className="search-button">🔍</button>
                </div>
                <div className="right-buttons">
                    <button className="watchlist">Watchlist</button>
                    <button className="sign-in" onClick={() => navigate('/login')}>Sign In</button>
                    <button className="sign-up" onClick={() => navigate('/signup')}>Sign Up</button>
                    <button className="language-select">EN</button>
                </div>
            </div>
        </header>
    );
};

export default Header;
=======
import React, { useState } from 'react';
import './Header.css';

const Header = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    return (
        <>
            <div className="container">
                <div className="listcontainer">

                        <li>TV Shows
                                <li>Trending TV Shows</li>
                                <li>Top TV Shows</li>
                        </li>


                </div>
            </div>
        </>
    );
};

export default Header;
>>>>>>> b4d5f92cc3402d27f460fd693cea28090e3f1610

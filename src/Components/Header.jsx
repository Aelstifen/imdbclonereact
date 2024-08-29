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

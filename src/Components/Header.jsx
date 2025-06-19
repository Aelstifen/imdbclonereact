import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import './Header.css';


const Header = ({toggleMenu}) => {
    const navigate = useNavigate();
    const [isSearchVisible, setIsSearchVisible] = useState(false);


    return (
        <header className="header">
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

                <div className="search-container">
                    {!isSearchVisible && (
                        <button
                            className="search-toggle-button"
                            onClick={() => setIsSearchVisible(true)}
                        >
                            🔍 Search
                        </button>
                    )}

                    <div className={`search-bar-wrapper ${isSearchVisible ? 'visible' : ''}`}>
                        <div className="search-bar">
                            <select className="search-category">
                                <option value="all">All</option>
                                <option value="TV Series">TV Series</option>
                                <option value="Movies">Movies</option>
                                <option value="Shorts">Shorts</option>
                            </select>
                            <input type="text" placeholder="Search..."/>
                            <button className="search-button">🔍</button>
                            <button
                                className="search-close-button"
                                onClick={() => setIsSearchVisible(false)}
                            >
                                ❌
                            </button>
                        </div>
                    </div>
                </div>

                <div className="right-buttons">
                    <button className="watchlist" onClick={() => navigate('/watchlist')}>
                        Watchlist
                    </button>
                    <button className="sign-in" onClick={() => navigate('/login')}>Sign In</button>
                    <button className="sign-up" onClick={() => navigate('/signup')}>Sign Up</button>
                    <button className="language-select">EN</button>
                </div>
            </div>
        </header>
    );
};

export default Header;

import React, { useState } from 'react';
import { useNavigate, useLocation, useMatch } from 'react-router-dom';
import './Header.css';
import { User, Search } from 'lucide-react';
import { useAuth } from "./Hooks/useAuth.js";

const Header = ({
                    toggleMenu,
                    adminSection,
                    onAdminSectionChange,
                    adminSearchTerm,
                    onAdminSearchChange,
                    showSearch
                }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isSearchVisible, setIsSearchVisible] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
    const [logoutMessage, setLogoutMessage] = useState('');
    const { isLoggedIn, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');

    const handleLogoutConfirmed = () => {
        logout();
        setShowLogoutConfirm(false);
        setIsProfileMenuOpen(false);
        setLogoutMessage('You have been logged out.');
        setTimeout(() => setLogoutMessage(''), 3000);
        navigate('/');
    };

    const isAdminRoute = location.pathname.startsWith('/admin');
    const match = useMatch({ path: '/', end: true });
    const isHome = typeof showSearch === 'boolean' ? showSearch : !!match;

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            navigate('/top-tv-shows', { state: { search: searchTerm } });
            setIsSearchVisible(false);
        }
    };

    const handleSearchKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    return (
        <header className="header">
            <div className="container">
                <div className="menu-container">
                    <button className="menu-toggle" onClick={toggleMenu}>
                        <span className="menu-icon">☰</span> Menu
                    </button>
                </div>

                {isAdminRoute ? (
                    <div className="admin-header-controls">
                        <h1 className="admin-header-title">Admin Dashboard</h1>
                        <div className="admin-search-sort-group">
                            <select
                                className="admin-sort-select"
                                value={adminSection}
                                onChange={(e) => onAdminSectionChange(e.target.value)}
                            >
                                <option value="none" disabled hidden>Sort By...</option>
                                <option value="title">Title Name</option>
                                <option value="actor">Actor Name</option>
                                <option value="user">User</option>
                            </select>
                            <input
                                type="text"
                                className="admin-search-input"
                                placeholder="Search titles or actors..."
                                value={adminSearchTerm || ''}
                                onChange={(e) => onAdminSearchChange(e.target.value)}
                            />
                            <button className="admin-search-button" type="button">
                                <Search size={20}/>
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="home-icon-container">
                            <button className="home-button" onClick={() => navigate('/')}>🏠</button>
                        </div>

                        <div className={`search-container ${isHome ? '' : 'search-hidden'}`}>
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
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        onKeyDown={handleSearchKeyDown}
                                    />
                                    <button className="search-button" onClick={handleSearch}>🔍</button>
                                    <button
                                        className="search-close-button"
                                        onClick={() => setIsSearchVisible(false)}
                                    >
                                        ❌
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}

                <div className="right-buttons">
                    <div className="profile-dropdown">
                        <button
                            className="profile-icon"
                            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                        >
                            <User size={20}/>
                        </button>
                        {isProfileMenuOpen && (
                            <div className="profile-menu">
                                {isLoggedIn ? (
                                    <>
                                        <button onClick={() => navigate('/watchlist')}>Watchlist</button>
                                        <button onClick={() => navigate('/userprofile')}>Profile Settings</button>
                                        <button onClick={() => setShowLogoutConfirm(true)}>Logout</button>
                                    </>
                                ) : (
                                    <>
                                        <button onClick={() => navigate('/login')}>Sign In</button>
                                        <button onClick={() => navigate('/signup')}>Sign Up</button>
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <button className="language-select">EN</button>
                </div>
            </div>

            {showLogoutConfirm && (
                <div className="logout-confirm-overlay">
                    <div className="logout-confirm-box">
                        <p className="logout-confirm-text">Are you sure you want to log out?</p>
                        <div className="logout-buttons">
                            <button className="confirm-btn" onClick={handleLogoutConfirmed}>Yes</button>
                            <button className="cancel-btn" onClick={() => setShowLogoutConfirm(false)}>Cancel</button>
                        </div>
                    </div>
                </div>
            )}

            {logoutMessage && (
                <div className="logout-message">{logoutMessage}</div>
            )}
        </header>
    );
};

export default Header;
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from './Components/Header.jsx';
import Menu from './Components/Menu.jsx';
import Slider from './Components/Slider.jsx';
import SamplePage from './Components/SampleBrowsePage.jsx';
import ShowDetailsPage from './Components/Details.jsx';
import LoginPage from './Components/SampleLoginPage.jsx';
import SignupPage from './Components/SampleSignUpPage.jsx';
import MovieSummary from './Components/MovieSummary.jsx';
import Watchlist from './Components/Watchlist';

function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation();

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const isHome = location.pathname === '/';

    return (
        <div className="App">
            {!isMenuOpen && (
                <>
                    <Header toggleMenu={toggleMenu} />
                    {isHome && <Slider />}
                    {isHome && (
                        <MovieSummary summary="This is a sample movie summary. The movie tells the tale of an epic journey through unknown lands, filled with adventure, mystery, and excitement." />
                    )}
                </>
            )}
            {isMenuOpen && <Menu onClose={toggleMenu} />}

            <Routes>
                <Route path="/" element={<></>} />
                <Route path="/top-movies" element={<SamplePage />} />
                <Route path="/trending-movies" element={<SamplePage />} />
                <Route path="/top-tv-shows" element={<SamplePage />} />
                <Route path="/trending-tv-shows" element={<SamplePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/watchlist" element={<Watchlist />} />
                <Route path="/show-details/:id" element={<ShowDetailsPage />} />
            </Routes>
        </div>
    );
}

function AppWrapper() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default AppWrapper;
// This is the main entry point of the application. It wraps the App component with Router to enable routing functionality.
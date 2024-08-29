import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
import './App.css';
import Header from "./Components/Header";
import Menu from "./Components/Menu";
import Slider from "./Components/Slider";
import SamplePage from "./Components/SampleBrowsePage";
import LoginPage from "./Components/SampleLoginPage"; // Import LoginPage
import SignupPage from "./Components/SampleSignUpPage"; // Import SignupPage
import MovieSummary from "./Components/MovieSummary";

function App() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation(); // Get the current location

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // Determine if we should show the Slider based on the current path
    const showSliderAndSummary = ![
        '/top-movies',
        '/trending-movies',
        '/top-tv-shows',
        '/trending-tv-shows',
        '/login',
        '/signup',
    ].includes(location.pathname);

    return (
        <div className="App">
            {!isMenuOpen && (
                <>
                    <Header toggleMenu={toggleMenu} />
                    {showSliderAndSummary && <Slider />}
                    {showSliderAndSummary && (
                        <MovieSummary summary="This is a sample movie summary. The movie tells the tale of an epic journey through unknown lands, filled with adventure, mystery, and excitement. The protagonists face numerous challenges and grow stronger as they uncover the secrets that shape their world." />
                    )}
                </>
            )}
            {isMenuOpen && <Menu onClose={toggleMenu} />}

            {/* Define Routes */}
            <Routes>
                <Route path="/top-movies" element={<SamplePage />} />
                <Route path="/trending-movies" element={<SamplePage />} />
                <Route path="/top-tv-shows" element={<SamplePage />} />
                <Route path="/trending-tv-shows" element={<SamplePage />} />
                <Route path="/login" element={<LoginPage />} /> {/* Login route */}
                <Route path="/signup" element={<SignupPage />} /> {/* Signup route */}
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

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
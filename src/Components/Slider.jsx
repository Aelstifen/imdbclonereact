import React from 'react';
import './Slider.css';
const Slider = () => {
    return (
        <div className="slider">
            <div className="slider-arrow left-arrow">
                <span>&lt;</span>
            </div>
            <div className="slider-content">
                <img
                    src="https://external-content.duckduckgo.com/iu/?u=http%3A%2F%2Fwww.mesnatur.com%2Fsites%2Fdefault%2Ffiles%2Fgemi-turlari-3_copy_0.jpg&f=1&nofb=1&ipt=436767af2b9fb86eac41105c18ff63fcaf85ed1952aac89282053477f9de98b1&ipo=images"
                    alt="Main Slide"
                    className="slider-image"
                />
                <div className="overlay">
                    <img
                        src="path/to/thumbnail.jpg"
                        alt="Thumbnail"
                        className="thumbnail"
                    />
                    <div className="play-button">
                        <span>&#9654;</span>
                    </div>
                    <div className="slider-title">
                        <h3>'The Lord of the Rings: The War of the Rohirrim'</h3>
                        <span className="slider-duration">2:26</span>
                    </div>
                </div>
            </div>
            <div className="slider-arrow right-arrow">
                <span>&gt;</span>
            </div>
        </div>
    );
};
export default Slider;
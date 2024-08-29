<<<<<<< HEAD
/*
=======
>>>>>>> b4d5f92cc3402d27f460fd693cea28090e3f1610
import React, {useState} from 'react';
import './Slider.css'; // Assuming you have a CSS file for styling

const Slider = () => {
    const images = [
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.IFcLd72cBkFmO0c1mw64MgHaEo%26pid%3DApi&f=1&ipt=d174f826573a6d38e7ee151e045b1c6fefe18646c2c27ea6a00fcd3971f31dac&ipo=images',
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fwww.seyirkafe.com%2Fwp-content%2Fuploads%2F2015%2F02%2Fen-guzel-gemi-resimleri-06-1024x576.jpg&f=1&nofb=1&ipt=f1e24cd7f69b400c9f186c5e4163a3b5e3a3499d3704635fd01b75390cf2fa9a&ipo=images',
        'https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.HCO00nFzFXX6TzHWigW2KQHaEi%26pid%3DApi&f=1&ipt=78032d05053e3a6fd908f69de39d6f576792a439a341239ed9f05b4fcbd38678&ipo=images'
    ];
    const [current, setCurrent] = useState(0);

    const nextSlide = () => {
        setCurrent(current === images.length - 1 ? 0 : current + 1);
    };

    const prevSlide = () => {
        setCurrent(current === 0 ? images.length - 1 : current - 1);
    };

    return (
        <div className="container">
            <button className="prev" onClick={prevSlide}>&lt;</button>
            <div className="slider">
                {images.map((image, index) => (
                    <div className={index === current ? 'slide active' : 'slide'} key={index}>
                        {index === current && (<img src={image} alt={`Image ${index + 1}`}/>)}
                    </div>
                ))}

            </div>
            <button className="next" onClick={nextSlide}>&gt;</button>
        </div>
    );
};

<<<<<<< HEAD
export default Slider;*/

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
=======
export default Slider;
>>>>>>> b4d5f92cc3402d27f460fd693cea28090e3f1610

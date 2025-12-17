import React from 'react';

const TitleForm = ({ titleData, onDataChange, allGenres, genresLoading }) => {
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        onDataChange(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const toggleGenre = (genre) => {
        onDataChange(prev => {
            const alreadySelected = prev.genres.includes(genre);
            return {
                ...prev,
                genres: alreadySelected
                    ? prev.genres.filter(g => g !== genre)
                    : [...prev.genres, genre]
            };
        });
    };

    const showSeasonEpisodeFields = titleData.titleType &&
        (titleData.titleType.toLowerCase().includes('tv') ||
            titleData.titleType.toLowerCase().includes('series'));

    return (
        <div className="admin-details-header">
            <div className="admin-details-poster">
                <img
                    src={titleData.imageLink || 'https://placehold.co/150x220/666/333?text=Poster'}
                    alt="Poster Preview"
                    onError={(e) => { e.target.src = "https://placehold.co/150x220/666/333?text=Invalid+URL"; }}
                />
            </div>

            <div className="admin-details-info">
                <div className="admin-details-form-group">
                    <label>Title Name</label>
                    <input type="text" name="primaryTitle" value={titleData.primaryTitle || ''} onChange={handleInputChange} />
                </div>
                <div className="admin-details-form-group">
                    <label>Image Link</label>
                    <input type="text" name="imageLink" value={titleData.imageLink || ''} onChange={handleInputChange} />
                </div>
                <div className="admin-details-form-group">
                    <label>Title Type</label>
                    <input type="text" name="titleType" value={titleData.titleType || ''} onChange={handleInputChange} />
                </div>
                <div className="admin-details-form-group">
                    <label>Genres</label>
                    <div className="genres-container">
                        {genresLoading ? (
                            <p>Loading genres...</p>
                        ) : (
                            allGenres.map(genre => (
                                <div
                                    key={genre}
                                    className={`genre-box ${titleData.genres?.includes(genre) ? 'selected' : ''}`}
                                    onClick={() => toggleGenre(genre)}
                                >
                                    {genre}
                                </div>
                            ))
                        )}
                    </div>
                </div>
                <div className="admin-details-form-group">
                    <label>Runtime (minutes)</label>
                    <input type="number" name="runtimeMinutes" value={titleData.runtimeMinutes || ''} onChange={handleInputChange} />
                </div>
                <div className="admin-details-form-group">
                    <label>Start Year</label>
                    <input type="number" name="startYear" value={titleData.startYear || ''} onChange={handleInputChange} />
                </div>

                {showSeasonEpisodeFields && (
                    <>
                        <div className="admin-details-form-group">
                            <label>Number of Seasons</label>
                            <input type="number" name="numSeasons" value={titleData.numSeasons || ''} onChange={handleInputChange} min="0" />
                        </div>
                        <div className="admin-details-form-group">
                            <label>Number of Episodes</label>
                            <input type="number" name="numEpisodes" value={titleData.numEpisodes || ''} onChange={handleInputChange} min="0" />
                        </div>
                    </>
                )}

                <div className="admin-details-checkbox-group">
                    <input type="checkbox" name="isAdult" id="isAdult" checked={!!titleData.isAdult} onChange={handleInputChange} />
                    <label htmlFor="isAdult">Is Adult?</label>
                </div>
            </div>
        </div>
    );
};

export default TitleForm;
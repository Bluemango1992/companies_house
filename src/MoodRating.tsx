import React, { useState } from 'react';
import './MoodRating.css';
import SentimentDissatisfiedOutlinedIcon from '@mui/icons-material/SentimentDissatisfiedOutlined';
import SentimentSatisfiedOutlinedIcon from '@mui/icons-material/SentimentSatisfiedOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';

const MoodRating = () => {
  const [isRatingVisible, setIsRatingVisible] = useState(false); // To control visibility of the rating component
  const [mood, setMood] = useState(50); // To control the slider value

  // Toggle the rating form visibility
  const toggleRating = () => {
    setIsRatingVisible(!isRatingVisible);
  };

  // Update mood value on slider change
  const handleMoodChange = (event) => {
    setMood(event.target.value);
  };

  return (
    <div className="mood-rating-container">
      {/* Button to show/hide the rating slider */}
      <button className="rate-mood-button" onClick={toggleRating}>
        {isRatingVisible ? <CloseOutlinedIcon /> : 'Rate Your Experience'}
      </button>

      {/* Rating form that appears with a transition */}
      <div className={`rating-form ${isRatingVisible ? 'visible' : ''}`}>
        <div className="slider-container">
          <SentimentDissatisfiedOutlinedIcon />
          <input
            type="range"
            min="0"
            max="100"
            value={mood}
            onChange={handleMoodChange}
            className="slider"
          />
        </div>
      </div>
    </div>
  );
};

export default MoodRating;

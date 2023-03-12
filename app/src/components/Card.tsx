import React from 'react';
const imgsrc = "https://i.imgur.com/3J3wW9S.png"
const Card = ({ imageSrc, title, description }) => {
  return (
    <div>
      <img src={imageSrc} alt={title} style={{width:"22em"}} />
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};

export default Card;
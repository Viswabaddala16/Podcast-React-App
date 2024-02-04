import React from 'react'
import './style.css';
import { Link } from 'react-router-dom';
function PodcastCard({key,id,title,displayImage}) {
  return (
    <Link to={`/podcast/${id}`} key={key}>
        <div className='podcast-card'>    
        <img src={displayImage} className='displayImage-podcast' />
        <h1 className='title-podcast'>{title}</h1>
        </div>
    </Link>
    
  )
}

export default PodcastCard;

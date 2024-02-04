import React from 'react'
import Button from '../../Common/Button';

function EpisodeDetails({title,description,audioFile,onClick,index,onDelete}) {
  return (
    <div style={{width: "100%"}}>
      <h1 style={{margin: "0rem", textAlign:"left",marginBottom: "0"}}>{index}.{title}</h1>
      <p style={{marginLeft: "1.5rem"}} className='podcasr-description'>{description}</p>
      
      <Button text={"Play"} 
      onClick={() => onClick(audioFile)}
      style={{width : "150px",marginLeft: "1rem"}}
       />
       {onDelete && (
                <Button text="Delete" onClick={() => onDelete()} style={{ width: "150px", marginLeft: "1rem" }} />
            )}
    </div>
  )
}

export default EpisodeDetails;

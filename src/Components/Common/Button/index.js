import React from 'react'
import "./style.css";
function Button({text,onClick,disabled,style}) {
  return (
    <div onClick={onClick} disabled = {disabled} className='custom-btn' style={style}>
        {text}
    </div>
  )
}

export default Button;

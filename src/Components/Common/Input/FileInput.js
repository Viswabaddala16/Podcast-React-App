import React, { useState } from 'react';
import "./style.css";



function FileInput({accept,id,fileHandleFunc,text}) {
  const[fileSelected,setFileSelected] = useState("");
  function onChange(e){
    setFileSelected(e.target.files[0].name);
    fileHandleFunc(e.target.files[0])
  }

  return (
    <div style={{width : "70%"}}>
      <label htmlFor={id} 
      className= {`custom-input ${!fileSelected ? "label-input" : "active"}`} >
        {fileSelected ? `File was Selected ${fileSelected}` : text}
      </label>

      <input id={id} 
          type="file" 
          style={{display : "none"}} 
          accept={accept} onChange={onChange} />
    </div>
  )
}

export default FileInput;

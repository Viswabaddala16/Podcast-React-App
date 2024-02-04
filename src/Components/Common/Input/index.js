import React, { useState } from 'react';
import './style.css';

function InputIncomponent({ state,setState,type,placeholder, required }) {
  

  return (
    <input
      type={type}
      state={state}
      onChange={(e) => setState(e.target.value)}
      placeholder={placeholder}
      required={required}
      className="custom-input"
    />
  );
}

export default InputIncomponent;

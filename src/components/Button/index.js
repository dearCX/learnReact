import React from 'react';

const Btn = ({className = '', onClick, children}) => 
  <button
    className={className}
    onClick={onClick}
    type="button"
    >{children}</button>

export default Btn;
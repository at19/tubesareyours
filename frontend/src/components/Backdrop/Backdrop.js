import React from 'react'
import './Backdrop.css';

const Backdrop = ({onBackdropClick}) => {
  return (
    <div className="backdrop" onClick={onBackdropClick}></div>
  )
}

export default Backdrop;
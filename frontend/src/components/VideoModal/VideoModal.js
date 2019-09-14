import React from 'react'
import './VideoModal.css';

const VideoModal = ({title, children, canCancel, canConfirm, onCancel, onConfirm}) => {
  return (
    <div className="video-modal">
      <h3 className="video-modal__header">{title}</h3>
      <div className="video-modal__content">
        {children}
      </div>
      <div className="video-modal__actions">
        {canCancel && <button className="btn" onClick={onCancel}>Cancel</button>}
        {canConfirm && <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>}
      </div>
      
    </div>
  )
}

export default VideoModal;
import React from 'react'
import './FormInputItem.css';

const FormInputItem = ({ itemId, itemType, itemLabel, itemRef }) => (
  <>
    <label htmlFor={itemId}>{itemLabel}</label>
    <input type={itemType} id={itemId} ref={itemRef} />
  </>
)

export default FormInputItem;
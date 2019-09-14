import React from 'react'
import './FormInputGroup.css';

const FormInputGroup = ({className, children}) => (
  <div className={className}>
    {children}
  </div>
)

export default FormInputGroup;
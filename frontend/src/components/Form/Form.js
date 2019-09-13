import React from 'react'
import './Form.css';

const Form = ({
  emailRef,
  passwordRef, 
  nameRef, 
  onSubmit}) => {
  return (
      <form className="form" onSubmit={onSubmit}>
        <div className="form-control">
          <label htmlFor="name">Name</label>
          <input type="text" id="name" ref={nameRef}/>
        </div>
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={emailRef}/>
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={passwordRef}/>
        </div>
        <div className="form-action">
          <button type="button">Create an account</button>
          <button type="submit">Sign In</button>
        </div>
      </form>
  )
}

export default Form;
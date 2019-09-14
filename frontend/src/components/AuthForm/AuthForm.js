import React from 'react'
import './AuthForm.css';
import FormInputGroup from '../FormInputGroup/FormInputGroup';
import FormInputItem from '../FormInputItem/FormInputItem';

const Form = ({
  isLogin,
  emailRef,
  passwordRef,
  nameRef,
  onSubmit,
  onSwitchMode }) => {
  return (
    <form className="form" onSubmit={onSubmit}>
      {!isLogin ? (<FormInputGroup className="form-control">
        <FormInputItem itemId="name" itemType="text" itemLabel="Name" itemRef={nameRef} />
      </FormInputGroup>) : null}
      <FormInputGroup className="form-control">
        <FormInputItem itemId="email" itemType="email" itemLabel="Email" itemRef={emailRef} />
      </FormInputGroup>
      <FormInputGroup className="form-control">
        <FormInputItem itemId="password" itemType="password" itemLabel="Password" itemRef={passwordRef} />
      </FormInputGroup>
      <FormInputGroup className="form-action">
        <button type="button" onClick={onSwitchMode}>{isLogin ? "Create an account" : "Login with email and password"}</button>
        <button type="submit">Sign In</button>
      </FormInputGroup>
    </form>
  )
}

export default Form;
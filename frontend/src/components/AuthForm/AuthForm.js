import React, { useRef } from 'react'
import './AuthForm.css';

const Form = ({
  isLogin,
  emailRef,
  passwordRef,
  nameRef,
  onSubmit,
  switchMode }) => {

  const containerRef = useRef(null);

  const switchToSignInClicked = () => {
    containerRef.current.classList.remove("right-panel-active");
    switchMode();
  }

  const switchToSignUpClicked = () => {
    containerRef.current.classList.add("right-panel-active");
    switchMode();
  }

  return (
    <>
      <div className="authForm" ref={containerRef}>
        <div className="form-container sign-up-container">
          <form action="#">
            <h1>Create Account</h1>
            <input type="text" placeholder="Name" ref={!isLogin ? nameRef : null} />
            <input type="email" placeholder="Email" ref={!isLogin ? emailRef : null} />
            <input type="password" placeholder="Password" ref={!isLogin ? passwordRef : null} />
            <button onClick={onSubmit}>Sign Up</button>
          </form>
        </div>

        <div className="form-container sign-in-container">
          <form action="#">
            <h1>Sign in</h1>
            <input type="email" placeholder="Email" ref={isLogin ? emailRef : null} />
            <input type="password" placeholder="Password" ref={isLogin ? passwordRef : null} />
            <a href="/">Forgot your password?</a>
            <button onClick={onSubmit}>Sign In</button>
          </form>
        </div>

        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" id="signIn" onClick={switchToSignInClicked}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button className="ghost" id="signUp" onClick={switchToSignUpClicked}>Sign Up</button>
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

export default Form;
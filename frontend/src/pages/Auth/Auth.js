import React, { useState, useRef, useContext } from 'react'
import "./Auth.css";
import Form from '../../components/AuthForm/AuthForm';

import AuthContext from '../../contexts/auth-context';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const emailElement = useRef(null);
  const passwordElement = useRef(null);
  const nameElement = useRef(null);
  const authContext = useContext(AuthContext);

  const onSubmitClick = event => {
    event.preventDefault();

    const email = emailElement.current.value;
    const password = passwordElement.current.value;
    passwordElement.current.value = "";
    const name = !isLogin ? nameElement.current.value : null;

    const requestBody = isLogin ? ({
      query: `
        query {
          login(email: "${email}", password: "${password}") {
            userId
            token
            tokenExpiration
          }
        }
      `
    }) : ({
      query: `
        mutation {
          createUser(userInput: { name: "${name}", email: "${email}", password: "${password}" }) {
            _id
            email
          }
        }
      `
    });

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        console.log(res);
        throw new Error("Failed");
      }
      return res.json();
    }).then(resData => {
      if (isLogin) {
        const { userId, token, tokenExpiration } = resData.data.login;
        if (token) {
          authContext.login(userId, token, tokenExpiration);
        }
      }else {
        setIsLogin(true);
      }
    }).catch(err => {
      throw new Error(err);
    })
  }

  const onSwitchModeClick = event => {
    event.preventDefault();
    setIsLogin(!isLogin);
  }

  return (
    <Form
      isLogin={isLogin}
      emailRef={emailElement}
      passwordRef={passwordElement}
      nameRef={nameElement}
      onSubmit={onSubmitClick}
      onSwitchMode={onSwitchModeClick} />
  )
}

export default Auth;
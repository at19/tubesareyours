import React, { useState, useRef } from 'react'
import "./Auth.js";
import Form from '../components/Form/Form.js';

function Auth() {
  const emailElement = useRef(null);
  const passwordElement = useRef(null);
  const nameElement = useRef(null);

  const onSubmitClick = event => {
    event.preventDefault();

    const email = emailElement.current.value;
    const password = passwordElement.current.value;
    const name = nameElement.current.value;

    const requestBody = {
      query: `
        mutation {
          createUser(userInput: { name: "${name}", email: "${email}", password: "${password}" }) {
            _id
            email
          }
        }
      `
    };

    console.log(requestBody);

    fetch("http://localhost:8000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json"
      }
    }).then(res => {
      if (res.status !== 200 && res.status !== 201) {
        console.log(res)
        throw new Error("Failed")
      }
      return res.json();
    }).then(resData => {
      console.log(resData)
    }).catch(err => {
      throw new Error(err);
    })
  }

  return (
    <Form 
     emailRef={emailElement} 
     passwordRef={passwordElement} 
     nameRef={nameElement} 
     onSubmit={onSubmitClick}
     onSwitchMode={onSwitchModeClick} />
  )
}

export default Auth;
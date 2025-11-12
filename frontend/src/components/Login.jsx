import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom'; 


export default function Login({ onSubmit }) {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  return (
    <AuthForm onSubmit={(e) => {
      e.preventDefault(); 
      onSubmit(email, pass);
    }}>
      <h2>Login</h2>
      <InputGroup>
        <label htmlFor="login-email">Email</label>
        <input id="login-email" type="email" placeholder="you@example.com" required onChange={(e) => setEmail(e.target.value)}/>
      </InputGroup>
      <InputGroup>
        <label htmlFor="login-password">Password</label>
        <input id="login-password" type="password" placeholder="••••••••" required onChange={(e) => setPass(e.target.value)}/>
      </InputGroup>
      <AuthSubmitButton type="submit">
        Login
      </AuthSubmitButton>
      <AuthSwitchText>
        Don't have an account?{' '}
        <Link to="/register">
          Register instead
        </Link>
      </AuthSwitchText>
    </AuthForm>
  );
}


export const AuthForm = styled.form`
  h2 {
    font-size: 2rem;
    font-weight: 700;
    color: #333;
    text-align: center;
    margin-bottom: 2rem;
  }
`;

export const InputGroup = styled.div`
  margin-bottom: 1.5rem;
  label {
    display: block;
    margin-bottom: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    color: #555;
  }
  input {
    width: 100%;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    color: #333;
    background-color: #ffffff;
    border: 1px solid #ccc;
    border-radius: 8px;
    box-sizing: border-box;
    transition: border-color 0.2s, box-shadow 0.2s;
    &:focus {
      outline: none;
      border-color: #007bff;
      box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.15);
    }
  }
`;

export const AuthSubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  color: #ffffff;
  background-color: #007bff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #0056b3;
  }
`;

export const AuthSwitchText = styled.p`
  margin-top: 1.5rem;
  font-size: 0.875rem;
  color: #777;
  text-align: center;
  
  /* Style for the <Link> component */
  a {
    color: #007bff;
    font-weight: 600;
    cursor: pointer;
    text-decoration: none;
    &:hover {
      text-decoration: underline;
    }
  }
`;
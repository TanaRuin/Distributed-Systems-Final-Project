import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AuthForm,
  InputGroup,
  AuthSubmitButton,
  AuthSwitchText
} from './Login.jsx';

export default function Register({ onSubmit }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  return (
    <AuthForm onSubmit={(e) => {
      e.preventDefault(); 
      onSubmit(name, email, pass);
    }}>
      <h2>Register</h2>
      <InputGroup>
        <label htmlFor="register-name">Name</label>
        <input id="register-name" type="text" placeholder="Your Name" required onChange={(e) => setName(e.target.value)}/>
      </InputGroup>
      <InputGroup>
        <label htmlFor="register-email">Email</label>
        <input id="register-email" type="email" placeholder="you@example.com" required onChange={(e) => setEmail(e.target.value)}/>
      </InputGroup>
      <InputGroup>
        <label htmlFor="register-password">Password</label>
        <input id="register-password" type="password" placeholder="••••••••" required onChange={(e) => setPass(e.target.value)}/>
      </InputGroup>
      <AuthSubmitButton type="submit">
        Register
      </AuthSubmitButton>
      <AuthSwitchText>
        Already have an account?{' '}
        <Link to="/login">
          Login instead
        </Link>
      </AuthSwitchText>
    </AuthForm>
  );
}


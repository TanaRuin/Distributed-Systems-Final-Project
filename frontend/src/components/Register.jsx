import React from 'react';
import { Link } from 'react-router-dom';
import {
  AuthForm,
  InputGroup,
  AuthSubmitButton,
  AuthSwitchText
} from './Login.jsx';

export default function Register({ onSubmit }) {
  return (
    <AuthForm onSubmit={onSubmit}>
      <h2>Register</h2>
      <InputGroup>
        <label htmlFor="register-name">Name</label>
        <input id="register-name" type="text" placeholder="Your Name" required />
      </InputGroup>
      <InputGroup>
        <label htmlFor="register-email">Email</label>
        <input id="register-email" type="email" placeholder="you@example.com" required />
      </InputGroup>
      <InputGroup>
        <label htmlFor="register-password">Password</label>
        <input id="register-password" type="password" placeholder="••••••••" required />
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


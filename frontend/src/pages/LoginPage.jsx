import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Login from '../components/Login';



const AuthPageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #ffffff; /* White background */
`;

const AuthFormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background-color: #f5f5f5; /* Greyish box */
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
`;

export default function LoginPage({ onLoginSuccess }) {
  
  const navigate = useNavigate();

  
  const handleLogin = (e) => {
    e.preventDefault(); 
    console.log('Login attempt...');
    onLoginSuccess(); 
    navigate('/rooms'); 
  };

  

  return (
    <AuthPageContainer>
      <AuthFormWrapper>
        {/* We now ONLY render the Login component */}
        <Login onSubmit={handleLogin} />
      </AuthFormWrapper>
    </AuthPageContainer>
  );
}
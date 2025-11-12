import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Register from '../components/Register';
import { register, setAuth } from '../service/auth';
import { toast } from 'react-toastify';


const AuthPageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background-color: #ffffff;
`;

const AuthFormWrapper = styled.div`
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background-color: #f5f5f5;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  border: 1px solid #e0e0e0;
`;

export default function RegisterPage() {
  const navigate = useNavigate();

  const handleRegister = async(name, email, pass) => {    
    const resp = await register(name, email, pass);
    
    if (resp.success) {
      toast.success(resp.message);
      setAuth(resp.user);
      navigate('/rooms');
    } else {
      toast.error(resp.message);
    }
  };

  return (
    <AuthPageContainer>
      <AuthFormWrapper>
        {/* We only render the Register component here */}
        <Register onSubmit={handleRegister} />
      </AuthFormWrapper>
    </AuthPageContainer>
  );
}
import { useState, useRef, useEffect, use } from 'react';

import { Send, Flame, ChevronLeft } from 'lucide-react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getMessages } from '../service/message';
import { toast } from 'react-toastify';
import { getUserData } from '../service/auth';


const ChatGlobals = createGlobalStyle`
  .chat-area::-webkit-scrollbar {
    width: 8px;
  }
  .chat-area::-webkit-scrollbar-track {
    background: #f0f0f0;
  }
  .chat-area::-webkit-scrollbar-thumb {
    background: #ccc;
    border-radius: 4px;
  }
  .chat-area::-webkit-scrollbar-thumb:hover {
    background: #aaa;
  }
`;


const pulse = keyframes`
  0%, 100% {
    opacity: 0.7;
  }
  50% {
    opacity: 1;
  }
`;

export default function ChatBox() {
  const { roomCode } = useParams();
  const location = useLocation();
  const { roomId } = location.state;
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sendToAI, setSendToAI] = useState(true);
  const [userName, setUserName] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (input.trim() === '') return;
    const newMessage = {
      id: messages.length + 1,
      user: userName,
      text: input,
      isAI: false,
    };
    setMessages([...messages, newMessage]);
    setInput('');
    if (sendToAI) {
      setTimeout(() => {
        const responses = [
          `Those who forged our own destiny and future.`,
          `We are the inheritors of memory and legend.`,
          `That is Natlan's fire, the lifeblood of our nation.`,
          `Those who grew alongside sun and wind.!`,
        ];
        const aiResponse = {
          id: messages.length + 2,
          user: 'Tumaini',
          text: responses[Math.floor(Math.random() * responses.length)],
          isAI: true,
        };
        setMessages(prev => [...prev, aiResponse]);
      }, 800);
    }
  };

  const fetchMessages = async() => {
    const resp = await getMessages(roomId);
        
    if (resp.success) {
      setMessages(resp.chats);
    } else {
      toast.error(resp.message);
    }
    setLoading(false);
  }

  useEffect(() => {
    setLoading(true);
    const user = getUserData();
    setUserName(user.name);
    fetchMessages();
  }, []);

  return (
    !loading && <ChatContainer>
      <ChatGlobals /> {/* Injects global styles */}
      
      <Header>
        <HeaderContent>
          <HeaderLeft>
            {/* --- ADDED: Back Button --- */}
            <BackButton onClick={() => navigate('/rooms')}>
              <ChevronLeft size={24} />
            </BackButton>
            <StatusDot />
            <HeaderTitle>
              <h1>
                <Flame size={24} style={{ color: '#FF6B35' }} />
                Natlan Expedition
              </h1>
              <HeaderSubtitle>Land of Fire & Spirit</HeaderSubtitle>
            </HeaderTitle>
          </HeaderLeft>
          <HeaderRoom>Base Camp</HeaderRoom>
        </HeaderContent>
      </Header>

      <ChatArea className="chat-area"> {/* Added class for scrollbar */}
        {messages.map((msg) => (
          <Message key={msg._id} $isAI={msg.isAI}>
            <MessageContent $isAI={msg.isAI}>
              <MessageHeader>
                {msg.isAI ? (
                  <>
                    <Flame size={16} />
                    <MessageAuthor>Yohuateclin</MessageAuthor>
                  </>
                ) : (
                  <MessageAuthor>{msg.user}</MessageAuthor>
                )}
              </MessageHeader>
              <MessageText>{msg.message}</MessageText>
            </MessageContent>
          </Message>
        ))}
        <div ref={messagesEnd} />
      </ChatArea>

      <InputArea>
        <InputControls>
          <NameInput
            type="text"
            placeholder="Enter your name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
          <CheckboxLabel>
            <input
              type="checkbox"
              checked={sendToAI}
              onChange={(e) => setSendToAI(e.target.checked)}
            />
            Ask Guide
          </CheckboxLabel>
        </InputControls>

        <MessageInputGroup>
          <MessageInput
            type="text"
            placeholder="Share your discoveries..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          />
          <SendButton onClick={handleSend}>
            <Send size={16} />
            Send
          </SendButton>
        </MessageInputGroup>
      </InputArea>
    </ChatContainer>
  );
}

// Styles for ChatBox
const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #ffffff;
  position: relative;
  color: #333;
`;

// --- ADDED: BackButton Style ---
const BackButton = styled.button`
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 4px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
`;

const Header = styled.header`
  position: relative;
  z-index: 10;
  background: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
  padding: 16px 24px;
  box-shadow: 0 4px 12px -5px rgba(0, 0, 0, 0.1);
`;

const HeaderContent = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const HeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const StatusDot = styled.div`
  width: 12px;
  height: 12px;
  background-color: #4caf50; /* Green for "online" */
  border-radius: 50%;
  animation: ${pulse} 2s ease-in-out infinite;
  box-shadow: 0 0 15px #4caf50;
`;

const HeaderTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  h1 {
    font-size: 24px;
    font-weight: bold;
    color: #222;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
  }
`;

const HeaderSubtitle = styled.p`
  font-size: 12px;
  color: #777;
  margin: 0;
`;

const HeaderRoom = styled.div`
  font-size: 12px;
  color: #888;
`;

const ChatArea = styled.div`
  position: relative;
  z-index: 10;
  flex: 1;
  overflow-y: auto;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const Message = styled.div`
  display: flex;
  margin-bottom: 12px;
  justify-content: ${props => props.$isAI ? 'flex-start' : 'flex-end'};
`;

const MessageContent = styled.div`
  max-width: 320px;
  padding: 12px 16px;
  border-radius: 16px;
  font-size: 14px;
  line-height: 1.5;
  box-shadow: 0 4px 10px -3px rgba(0, 0, 0, 0.1);
  
  /* Conditional styling based on $isAI prop */
  background: ${props => props.$isAI ? '#e0e0e0' : '#007bff'};
  color: ${props => props.$isAI ? '#222' : '#ffffff'};
  border-radius: ${props => props.$isAI ? '16px 16px 16px 0' : '16px 16px 0 16px'};
  border: 1px solid ${props => props.$isAI ? '#d5d5d5' : '#006fe6'};
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 4px;
  svg {
    color: #333;
  }
`;

const MessageAuthor = styled.span`
  font-size: 12px;
  font-weight: bold;
  color: ${props => props.$isAI ? '#333' : '#f0f0f0'};
`;

const MessageText = styled.p`
  font-size: 14px;
  margin: 0;
`;

const InputArea = styled.div`
  position: relative;
  z-index: 10;
  border-top: 2px solid #e0e0e0;
  background: #f5f5f5;
  padding: 16px 24px;
  box-shadow: 0 -10px 20px -5px rgba(0, 0, 0, 0.05);
`;

const InputControls = styled.div`
  display: flex;
  gap: 12px;
  margin-bottom: 12px;
`;

const NameInput = styled.input`
  flex: 1;
  padding: 8px 12px;
  background-color: #ffffff;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 14px;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const CheckboxLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  color: #333;
  cursor: pointer;
  font-size: 14px;
  input {
    width: 16px;
    height: 16px;
    accent-color: #007bff;
    cursor: pointer;
  }
`;

const MessageInputGroup = styled.div`
  display: flex;
  gap: 12px;
`;

const MessageInput = styled.input`
  flex: 1;
  padding: 12px 16px;
  background-color: #ffffff;
  color: #333;
  border: 1px solid #ccc;
  border-radius: 12px;
  font-size: 14px;
  font-family: inherit;
  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

const SendButton = styled.button`
  padding: 12px 24px;
  background: #007bff;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-weight: bold;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 12px -3px rgba(0, 123, 255, 0.4);

  &:hover {
    background: #0056b3;
    box-shadow: 0 6px 16px -3px rgba(0, 123, 255, 0.5);
    transform: scale(1.02);
  }
  &:active {
    transform: scale(0.98);
  }
`;
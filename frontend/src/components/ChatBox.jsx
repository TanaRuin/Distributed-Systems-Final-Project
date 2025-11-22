import { useState, useRef, useEffect } from 'react';

import { Send, Flame, ChevronLeft } from 'lucide-react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';
import { useLocation, useNavigate } from 'react-router-dom';
import { generateAiResponse, getMessages } from '../service/message';
import { toast } from 'react-toastify';
import { getUserById, getUserData } from '../service/auth';
import { socket } from '../service/socket.js';
import { getAllUserAi, getUserById, getUserData } from '../service/auth';
import io from "socket.io-client";


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
  const location = useLocation();
  const { room: initialRoom } = location.state;
  const [room, setRoom] = useState(initialRoom);
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sendToAI, setSendToAI] = useState(true);
  const [loading, setLoading] = useState(false);
  const [userMap, setUserMap] = useState({});
  const [aiUsers, setAiUsers] = useState([])
  const [aiType, setAiType] = useState('Gemini');
  const [aiIdSet, setAiIdSet] = useState(new Set());

  const messagesEnd = useRef(null);

  const scrollToBottom = () => {
    messagesEnd.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const fetchUserById = async(msg) => {
      const resp = await getUserById(msg.senderId);
      if (resp.success) {
        setUserMap(prev => ({ ...prev, [msg.senderId]: resp.user }));
        setRoom(prev => ({
          ...prev,
          participants: prev.participants.includes(msg.senderId)
            ? prev.participants
            : [...prev.participants, msg.senderId]
        }));
      }
    }

    const fetchNewMsg = async() => {
      setLoading(true);
      await fetchMessages();
      setLoading(false);
    }

    socket.emit("joinRoom", room._id);

    socket.on("receiveMessage", (msg) => {
      if (!userMap[msg.senderId]){
        fetchUserById(msg);
      }
      fetchNewMsg();
    });

    return () => {
      socket.off("receiveMessage");
    }
  }, []);

  useEffect(() => {
    const fetchAiUsers = async () => {
      const resp = await getAllUserAi();
      if (resp.success && resp.users) {
        setAiUsers(resp.users);
        setAiIdSet(new Set(resp.users.map(u => u._id)));
      }
    };
    fetchAiUsers();
  }, []);


  const handleSend = async() => {
    if (input.trim() === '') return;

    const user = getUserData();
    const newMessage = {
      senderId: user._id, 
      roomId: room._id, 
      message: input,
      isAiContext: sendToAI
    }
    socket.emit("sendMessage", newMessage);
    setInput('');


    if (sendToAI) {
      const resp = await generateAiResponse(input, aiType, room._id);
      const ai_user = aiUsers.find(u => u.name === aiType);

      if (resp.success) {
        const newMessage = {
          senderId: ai_user._id, 
          roomId: room._id, 
          message: resp.response,
          isAiContext: sendToAI 
        }
        socket.emit("sendMessage", newMessage);
      } 
      else {
        toast.error(resp.message);
      }
    }

  };

  const fetchMessages = async() => {
    console.log("fetching message")
    const resp = await getMessages(room._id);
        
    if (resp.success) {
      setMessages(resp.chats);
    } else {
      toast.error(resp.message);
    }
  }

  const fetchSenders = async () => {
    const senders = room.participants;
    console.log(room);
    const responses = await Promise.all(senders.map(id => getUserById(id)));

    const map = {};
    responses.forEach((resp, i) => {
      if (resp.success) {
        map[senders[i]] = resp.user;
      } else {
        toast.error(resp.message);
      }
    });

    setUserMap(map);
  };


  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await fetchSenders();
      await fetchMessages();
      setLoading(false);
    };
    init();
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
                {room.name}
              </h1>
            </HeaderTitle>
          </HeaderLeft>
          <HeaderRoom>Code: {room.code}</HeaderRoom>
        </HeaderContent>
      </Header>

      <ChatArea className="chat-area"> {/* Added class for scrollbar */}
        {messages.map((msg) => (
          <Message key={msg._id} $isAI={aiIdSet.has(msg.senderId)}>
            <MessageContent $isAI={aiIdSet.has(msg.senderId)}>
              <MessageHeader>
                {aiIdSet.has(msg.senderId) ? (
                  <>
                    <Flame size={16} />
                    <MessageAuthor  $isAI={aiIdSet.has(msg.senderId)}>{userMap[msg.senderId]?.name || "Unknown User"}</MessageAuthor>
                  </>
                ) : (
                  <MessageAuthor>{userMap[msg.senderId]?.name || "Unknown User"}</MessageAuthor>
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
          <CheckboxLabel>
            <input
              type="checkbox"
              checked={sendToAI}
              onChange={(e) => setSendToAI(e.target.checked)}
            />
            Ask Guide
          </CheckboxLabel>

          <SelectAI
            value={aiType}
            onChange={(e) => setAiType(e.target.value)}
          >
            {aiUsers.map((u) => (
              <option key={u._id} value={u.name}>
                {u.name}
              </option>
            ))}
          </SelectAI>

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

const HeaderRoom = styled.div`
  font-size: 18px;
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

const SelectAI = styled.select`
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background: #ffffff;
  color: #333;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: #007bff;
    box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
  }
`;

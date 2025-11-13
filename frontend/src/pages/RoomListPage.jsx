import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { createRoom, getAllRooms, joinRoom } from '../service/room';

export default function RoomListPage() {
  const [rooms, setRooms] = useState([]);
  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const [showJoinPopup, setShowJoinPopup] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState('');
  const [joinRoomCode, setJoinRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleCreateRoom = async(e) => {
    e.preventDefault();
    if (newRoomTitle.trim() === '') return;
    
    const resp = await createRoom(newRoomTitle);
    if(resp.success){
      toast.success(resp.message);
      setLoading(true);
      fetchRoomList();
    }
    else toast.error(resp.message);
    
    setNewRoomTitle('');
    setShowCreatePopup(false);
  };

  const handleJoinRoom = async(e) => {
    e.preventDefault();
    if (joinRoomCode.trim() === '') return;

    const resp = await joinRoom(joinRoomCode);
    if(resp.success){
      toast.success(resp.message);
      navigate(`/chat/${joinRoomCode}`, {state: {room: resp.room}});
    }
    else toast.error(resp.message);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("You have been logged out.");
    navigate("/login");
  };

  const fetchRoomList = async() => {
    const resp = await getAllRooms();
    
    if (resp.success) {
      setRooms(resp.rooms);
    } else {
      toast.error(resp.message);
    }
    setLoading(false);
  }

  useEffect(()=>{
    setLoading(true);
    fetchRoomList();
  },[]);

  return (
    !loading &&
    <RoomListContainer>
      {/* Create Room Popup (Modal) */}
      {showCreatePopup && (
        <PopupOverlay>
          <PopupContent as="form" onSubmit={handleCreateRoom}>
            <h2>Create Room</h2>
            <PopupInput
              type="text"
              placeholder="Title"
              value={newRoomTitle}
              onChange={(e) => setNewRoomTitle(e.target.value)}
              autoFocus
            />
            <PopupButtons>
              <PopupButton type="button" onClick={() => setShowCreatePopup(false)}>
                Cancel
              </PopupButton>
              <PopupButton type="submit" $primary>
                Create
              </PopupButton>
            </PopupButtons>
          </PopupContent>
        </PopupOverlay>
      )}

      {/* Join Room Popup (Modal) */}
      {showJoinPopup && (
        <PopupOverlay>
          <PopupContent as="form" onSubmit={handleJoinRoom}>
            <h2>Join Room</h2>
            <PopupInput
              type="text"
              placeholder="Room ID"
              value={joinRoomCode}
              onChange={(e) => setJoinRoomCode(e.target.value)}
              autoFocus
            />
            <PopupButtons>
              <PopupButton type="button" onClick={() => setShowJoinPopup(false)}>
                Cancel
              </PopupButton>
              <PopupButton type="submit" $primary>
                Join
              </PopupButton>
            </PopupButtons>
          </PopupContent>
        </PopupOverlay>
      )}

      {/* Main Page Content */}
      <RoomListHeader>
        <h1>Available Rooms</h1>
        <LogoutButton onClick={handleLogout}>Logout</LogoutButton>
      </RoomListHeader>
      <RoomList>
        {rooms.map((room) => (
          <RoomItem
            key={room.code}
            onClick={() => navigate(`/chat/${room.code}`, {state: {room: room}})}
          >
            {room.name}
          </RoomItem>
        ))}
      </RoomList>
      <RoomListActions>
        <ActionButton onClick={() => setShowCreatePopup(true)}>
          Create Room
        </ActionButton>
        <ActionButton onClick={() => setShowJoinPopup(true)}>
          Join Room
        </ActionButton>
      </RoomListActions>
    </RoomListContainer>
  );
}

// Styles for RoomListPage
const RoomListContainer = styled.div`
  min-height: 100vh;
  background-color: #ffffff;
  color: #333;
  display: flex;
  flex-direction: column;
`;

const RoomListHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between; /* space between title and button */
  padding: 1.5rem 2rem;
  background-color: #f5f5f5;
  border-bottom: 2px solid #e0e0e0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);

  h1 {
    font-size: 1.75rem;
    font-weight: 700;
    color: #222;
    margin: 0;
  }
`;

const LogoutButton = styled.button`
  background-color: #e74c3c;
  color: white;
  font-weight: 600;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #c0392b;
  }
`;

const RoomList = styled.div`
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
`;

// --- UPDATED: RoomItem Style ---
const RoomItem = styled.div`
  padding: 1rem 1.5rem;
  background-color: #f0f0f0; /* --- CHANGED: Light grey background --- */
  border: 1px solid #dcdcdc; /* --- CHANGED: Slightly darker border --- */
  color: #333; /* --- ADDED: Ensure dark text --- */
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  &:hover {
    background-color: #e0e0e0; /* --- CHANGED: Darker grey on hover --- */
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
    transform: translateY(-2px);
  }
`;

const RoomListActions = styled.footer`
  display: flex;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #f5f5f5; /* Greyish footer */
  border-top: 2px solid #e0e0e0;
`;

// --- UPDATED: ActionButton Style ---
const ActionButton = styled.button`
  flex: 1;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  font-weight: 600;
  color: #333; /* --- CHANGED: Dark text --- */
  background-color: #e0e0e0; /* --- CHANGED: Grey background --- */
  border: 1px solid #ccc; /* --- CHANGED: Grey border --- */
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover {
    background-color: #d5d5d5; /* --- CHANGED: Darker grey on hover --- */
  }
`;

// Popup / Modal Styles
const PopupOverlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const PopupContent = styled.div`
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  width: 90%;
  max-width: 400px;
  h2 {
    margin-top: 0;
    margin-bottom: 1.5rem;
    color: #333;
  }
`;

const PopupInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  box-sizing: border-box;
`;

const PopupButtons = styled.div`
  display: flex;
  gap: 0.75rem;
`;

const PopupButton = styled.button`
  flex: 1;
  padding: 0.6rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  border: 1px solid;
  transition: background-color 0.2s, color 0.2s;
  
  /* Conditional styling */
  background-color: ${props => props.$primary ? '#007bff' : '#e0e0e0'};
  color: ${props => props.$primary ? '#ffffff' : '#555'};
  border-color: ${props => props.$primary ? '#007bff' : '#ccc'};

  &:hover {
    background-color: ${props => props.$primary ? '#0056b3' : '#d5d5d5'};
  }
`;
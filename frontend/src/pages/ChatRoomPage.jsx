import ChatBox from '../components/ChatBox';
import { useParams } from 'react-router-dom';

export default function ChatRoomPage() {
  const { roomId } = useParams();
  
  
  console.log("Entering chat for room:", roomId);

  return <ChatBox />;
}
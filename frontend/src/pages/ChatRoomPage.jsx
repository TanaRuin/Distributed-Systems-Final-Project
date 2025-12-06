import ChatBox from '../components/ChatBox';
import { useParams } from 'react-router-dom';

export default function ChatRoomPage() {
  const { roomId } = useParams();
  
  const timestamp = Date.now();
  console.log("server restore: ", timestamp);
  console.log("Entering chat for room:", roomId);

  return <ChatBox />;
}
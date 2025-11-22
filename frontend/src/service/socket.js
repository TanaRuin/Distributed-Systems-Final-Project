import io from "socket.io-client";

const url = import.meta.env.VITE_API_URL;
const socket = io(url, {
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});

// Fired when connection drops (e.g., backend port 5000 goes down)
socket.on("disconnect", (reason) => {
  console.warn("Socket disconnect: ", reason);
  alert("Socket disconnected, please refresh the page.");
});

export {socket};

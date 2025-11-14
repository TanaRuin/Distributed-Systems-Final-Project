Sebelum mulai:
ini .env file (taruh di root backend):

- MONGO_URI=mongodb://localhost:27017/distributed_system_db
- REDIS_HOST=localhost
- REDIS_PORT=6379
- PORT=5000
- SOCKET_PORT=5001
- FRONTEND_URL=http://localhost:5173

ini .env file (taruh di frontend):

- VITE_API_URL=http://localhost:5000
- VITE_SOCKET_URL=http://localhost:5001

### Cara run backend:
- cd backend
- npm install
- docker compose up -d (ingat open app docker engine sebelum run command ini)
- node seeds/user.js
- node seeds/room.js 
- sekarang, coba buka di compass untuk cek apakah mongodb mu udah ter-seed belum (connect aja ke localhost:27017). kalau sudah ter-seed, berarti db mu udah aman.
- sekarang cd backend, npm run dev, npm run dev2
- lalu cd frontend, npm install, npm run dev

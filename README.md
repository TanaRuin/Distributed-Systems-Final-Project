Sebelum mulai:
ini .env file (taruh di root backend):

MONGO_URI=mongodb://localhost:27017/distributed_system_db
REDIS_HOST=localhost
REDIS_PORT=6379
PORT=5000
FRONTEND_URL=http://localhost:5173

### Cara run backend:
- cd backend
- npm install
- docker compose up -d (ingat open app docker engine sebelum run command ini)
- node seeds/user.js
- node seeds/room.js
- sekarang, coba buka di compass untuk cek apakah mongodb mu udah ter-seed belum (connect aja ke localhost:27017). 
